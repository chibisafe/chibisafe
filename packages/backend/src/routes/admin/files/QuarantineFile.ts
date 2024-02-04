import path from 'node:path';
import { CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import type { FastifyReply } from 'fastify';
import jetpack from 'fs-jetpack';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { SETTINGS } from '@/structures/settings.js';
import { deleteThumbnails, getUniqueFileIdentifier, quarantinePath, uploadPath } from '@/utils/File.js';

export const options = {
	url: '/admin/file/:uuid/quarantine',
	method: 'post',
	middlewares: ['apiKey', 'auth', 'admin']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid } = req.params as { uuid: string };
	const { reason }: { reason: string } = req.body as { reason: string };

	const file = await prisma.files.findFirst({
		where: {
			uuid,
			quarantine: false
		}
	});

	if (!file) {
		void res.notFound("The file doesn't exist");
		return;
	}

	const uniqueIdentifier = await getUniqueFileIdentifier();
	const newFileName = String(uniqueIdentifier) + path.extname(file.name);

	if (file.isS3) {
		const { createS3Client } = await import('@/structures/s3.js');
		const S3Client = createS3Client();

		const copyCommand = new CopyObjectCommand({
			Bucket: SETTINGS.S3Bucket,
			Key: `/quarantine/${newFileName}`,
			CopySource: file.name
		});
		const removeCommand = new DeleteObjectCommand({
			Bucket: SETTINGS.S3Bucket,
			Key: file.name
		});

		await S3Client.send(copyCommand);
		await S3Client.send(removeCommand);
	}

	await prisma.files.update({
		where: {
			uuid
		},
		data: {
			quarantine: true,
			quarantineFile: {
				create: {
					name: newFileName,
					reason
				}
			}
		}
	});

	if (!file.isS3) {
		await jetpack.moveAsync(path.join(uploadPath, file.name), path.join(quarantinePath, newFileName));
	}

	void deleteThumbnails(file.name);

	return res.send({
		message: 'Successfully quarantined the file'
	});
};
