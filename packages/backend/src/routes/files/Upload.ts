import jetpack from 'fs-jetpack';
import path from 'node:path';

import { processFile } from '@chibisafe/uploader-module';
// import { processFile } from '../../../../../../chibisafe-uploader/packages/uploader-module/lib';
import { validateAlbum } from '@/utils/UploadHelpers';
import { generateThumbnails } from '@/utils/Thumbnails';
import { SETTINGS } from '@/structures/settings';
import {
	getUniqueFileIdentifier,
	storeFileToDb,
	constructFilePublicLink,
	constructFilePublicLinkNew,
	hashFile,
	checkFileHashOnDB,
	deleteTmpFile
} from '@/utils/File';
import process from 'node:process';

import type { FastifyReply } from 'fastify';
import type { RequestWithUser } from '@/structures/interfaces';

export const options = {
	url: '/upload',
	method: 'post',
	middlewares: [
		{
			name: 'apiKey',
			optional: true
		},
		{
			name: 'auth',
			optional: true
		}
	]
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const tmpDir = path.join(__dirname, '..', '..', '..', '..', '..', 'uploads', 'tmp');
	const maxChunkSize = SETTINGS.chunkSize;
	const maxFileSize = SETTINGS.maxSize;

	try {
		if (!SETTINGS.publicMode && !req.user)
			return await res.code(401).send({ message: 'Only registered users are allowed to upload files.' });
		const upload = await processFile(req.raw, {
			destination: tmpDir,
			maxFileSize,
			maxChunkSize,
			blockedExtensions: SETTINGS.blockedExtensions,
			debug: process.env.NODE_ENV !== 'production'
		});

		if (upload.isChunkedUpload && !upload.ready) {
			return await res.code(204).send();
		}

		// TODO: Validate if public uploads are allowed
		const album = await validateAlbum(req.headers.albumuuid as string, req.user ? req.user : undefined);

		// Assign a unique identifier to the file
		const uniqueIdentifier = await getUniqueFileIdentifier();
		if (!uniqueIdentifier) throw new Error('Could not generate unique identifier.');
		const newFileName = String(uniqueIdentifier) + path.extname(upload.metadata.name);
		req.log.debug(`> Name for upload: ${newFileName}`);

		// Move file to permanent location
		const newPath = path.join(__dirname, '..', '..', '..', '..', '..', 'uploads', newFileName);
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
			ip: req.ip
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

		const linkData = constructFilePublicLinkNew(req, uploadedFile.name);
		// Construct public link
		const fileWithLink = {
			...uploadedFile,
			...linkData
		};

		/*
		 * The response object structure.
		 * Use this to perform any additional actions after the upload is complete,
		 * such as moving the file to a different location, or adding it to a database.
		 * 	{
		 * 		"isChunkedUpload":false,
		 * 		"path":"tmp\\62376102-9737-4edb-86d0-7b3b05c4cd91.exe",
		 * 		"metadata":{
		 * 			"name":"parsec-windows.exe",
		 * 			"type":"application/x-msdownload",
		 * 			"size":"2881040"
		 * 		}
		 * 	}
		 */

		await res.code(200).send(fileWithLink);
	} catch (error: any) {
		let statusCode = 500;
		switch (error.message) {
			case 'Chunked upload is above size limit':
			case 'Chunk is too big':
			case 'File is too big':
				statusCode = 413;
				break;
			case 'Missing chibi-* headers':
			case 'chibi-uuid is not a string':
			case 'chibi-uuid does not meet the length criteria':
			case 'chibi-uuid is not a valid uuid':
			case 'Chunk is out of range':
			case 'Invalid headers':
				statusCode = 400;
				break;
		}

		res.log.error(error);
		await res.code(statusCode).send(error.message);
	}
};
