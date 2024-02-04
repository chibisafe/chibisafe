import path from 'node:path';
import process from 'node:process';
import { URL, fileURLToPath } from 'node:url';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { processFile } from '@chibisafe/uploader-module';
import type { FastifyReply } from 'fastify';
import jetpack from 'fs-jetpack';
// import { processFile } from '../../../../../../chibisafe-uploader/packages/uploader-module/lib';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { SETTINGS } from '@/structures/settings.js';
import {
	getUniqueFileIdentifier,
	storeFileToDb,
	constructFilePublicLink,
	hashFile,
	checkFileHashOnDB,
	deleteTmpFile
} from '@/utils/File.js';
import { generateThumbnails } from '@/utils/Thumbnails.js';
import { validateAlbum } from '@/utils/UploadHelpers.js';
import { getUsedQuota } from '@/utils/User.js';

export const options = {
	url: '/upload',
	method: 'post',
	middlewares: [
		{
			name: 'apiKey'
		},
		{
			name: 'auth',
			optional: true
		}
	]
};

export const uploadToNetworkStorage = async (req: RequestWithUser, res: FastifyReply) => {
	const { contentType, size, name } = req.body as { contentType: string; name: string; size: number };
	if (!contentType || !size || !name) {
		void res.badRequest('Missing file information');
		return;
	}

	const quota = await getUsedQuota(req.user?.id as number);
	if (quota?.overQuota) {
		void res.forbidden('You are over your storage quota');
		return;
	}

	if (!SETTINGS.publicMode && !req.user) {
		void res.unauthorized('Only registered users are allowed to upload files.');
		return;
	}

	const fileExtension = `.${name.split('.').pop()!}`.toLowerCase();
	if (SETTINGS.blockedExtensions.includes(fileExtension)) {
		void res.badRequest('File type is not allowed.');
		return;
	}

	// Assign a unique identifier to the file
	const uniqueIdentifier = await getUniqueFileIdentifier();
	if (!uniqueIdentifier) throw new Error('Could not generate unique identifier.');

	try {
		const { createS3Client } = await import('@/structures/s3.js');
		const identifier = `${uniqueIdentifier}${fileExtension}`;
		const url = await getSignedUrl(
			createS3Client(),
			new PutObjectCommand({
				Bucket: SETTINGS.S3Bucket,
				Key: identifier,
				ContentType: contentType,
				ContentLength: size
			}),
			{ expiresIn: 3600 }
		);

		await res.code(200).send({
			url,
			identifier,
			publicUrl: `${SETTINGS.S3PublicUrl || SETTINGS.S3Endpoint}/${identifier}`
		});
	} catch (error) {
		req.log.error(error);
		void res.internalServerError('Could not generate signed URL');
	}
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	if (SETTINGS.useNetworkStorage) return uploadToNetworkStorage(req, res);

	const tmpDir = fileURLToPath(new URL('../../../../../uploads/tmp', import.meta.url));
	const maxChunkSize = SETTINGS.chunkSize;
	const maxFileSize = SETTINGS.maxSize;

	const quota = await getUsedQuota(req.user?.id as number);
	if (quota?.overQuota) {
		void res.forbidden('You are over your storage quota');
		return;
	}

	try {
		if (!SETTINGS.publicMode && !req.user) {
			void res.unauthorized('Only registered users are allowed to upload files.');
			return;
		}

		const upload = await processFile(req.raw, {
			destination: tmpDir,
			maxFileSize,
			maxChunkSize,
			debug: process.env.NODE_ENV !== 'production'
		});

		if (upload.isChunkedUpload && !upload.ready) {
			return await res.code(204).send();
		}

		if (!upload.metadata.name) {
			await deleteTmpFile(upload.path as string);
			void res.badRequest('Missing file name.');
			return;
		}

		const fileExtension = `.${upload.metadata.name.split('.').pop()!}`.toLowerCase();
		if (SETTINGS.blockedExtensions.includes(fileExtension)) {
			await deleteTmpFile(upload.path as string);
			void res.badRequest('File type is not allowed.');
			return;
		}

		// Check if the new uploaded file sends the user over the quota
		const quotaAfterUpload = await getUsedQuota(req.user?.id as number, Number(upload.metadata.size));
		if (quotaAfterUpload?.overQuota) {
			await deleteTmpFile(upload.path as string);
			void res.forbidden('You are over your storage quota');
			return;
		}

		const album = await validateAlbum(req.headers.albumuuid as string, req.user ? req.user : undefined);

		// Assign a unique identifier to the file
		const uniqueIdentifier = await getUniqueFileIdentifier();
		if (!uniqueIdentifier) throw new Error('Could not generate unique identifier.');
		const newFileName = String(uniqueIdentifier) + path.extname(upload.metadata.name!);
		req.log.debug(`> Name for upload: ${newFileName}`);

		// Move file to permanent location
		const newPath = fileURLToPath(new URL(`../../../../../uploads/${newFileName}`, import.meta.url));
		const file = {
			name: newFileName,
			// @ts-ignore
			extension: path.extname(upload.metadata.name),
			path: newPath,
			// @ts-ignore
			original: upload.metadata.name as string,
			// @ts-ignore
			type: upload.metadata.type as string,
			// @ts-ignore
			size: String(upload.metadata.size),
			hash: await hashFile(upload.path as string),
			// @ts-ignore
			ip: req.ip,
			isS3: false
		};

		let uploadedFile;
		const fileOnDb = await checkFileHashOnDB(req.user, file);
		if (fileOnDb?.repeated) {
			uploadedFile = fileOnDb.file;
			await deleteTmpFile(upload.path as string);
		} else {
			await jetpack.moveAsync(upload.path as string, newPath);
			// Store file in database
			const savedFile = await storeFileToDb(req.user ? req.user : undefined, file, album ? album : undefined);

			uploadedFile = savedFile.file;

			// Generate thumbnails
			void generateThumbnails(savedFile.file.name);
		}

		const linkData = constructFilePublicLink({ req, fileName: uploadedFile.name });
		// Construct public link
		const fileWithLink = {
			...uploadedFile,
			...linkData
		};

		await res.code(200).send(fileWithLink);
	} catch (error: any) {
		switch (error.message) {
			case 'Chunked upload is above size limit':
			case 'Chunk is too big':
			case 'File is too big':
				void res.payloadTooLarge(error.message);
				break;
			case 'Missing chibi-* headers':
			case 'chibi-uuid is not a string':
			case 'chibi-uuid does not meet the length criteria':
			case 'chibi-uuid is not a valid uuid':
			case 'Chunk is out of range':
			case 'Invalid headers':
				void res.badRequest(error.message);
				break;
		}

		res.log.error(error);
	}
};
