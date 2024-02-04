import path from 'node:path';
import { CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import type { FastifyReply } from 'fastify';
import jetpack from 'fs-jetpack';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { SETTINGS } from '@/structures/settings.js';
import { quarantinePath, uploadPath } from '@/utils/File.js';
import { generateThumbnails } from '@/utils/Thumbnails.js';

export const options = {
	url: '/admin/file/:uuid/allow',
	method: 'post',
	middlewares: ['apiKey', 'auth', 'admin']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid } = req.params as { uuid: string };

	const file = await prisma.files.findFirst({
		where: {
			uuid,
			quarantine: true
		},
		select: {
			uuid: true,
			name: true,
			isS3: true,
			quarantineFile: true
		}
	});

	if (!file) {
		void res.notFound("The file doesn't exist");
		return;
	}

	if (file.isS3) {
		const { createS3Client } = await import('@/structures/s3.js');
		const S3Client = createS3Client();

		const copyCommand = new CopyObjectCommand({
			Bucket: SETTINGS.S3Bucket,
			Key: file.name,
			CopySource: `/quarantine/${file.quarantineFile!.name}`
		});
		const removeCommand = new DeleteObjectCommand({
			Bucket: SETTINGS.S3Bucket,
			Key: `/quarantine/${file.quarantineFile!.name}`
		});

		await S3Client.send(copyCommand);
		await S3Client.send(removeCommand);
	}

	await prisma.files.update({
		where: {
			uuid
		},
		data: {
			quarantine: false,
			quarantineFile: {
				delete: true
			}
		}
	});

	if (!file.isS3) {
		await jetpack.moveAsync(path.join(quarantinePath, file.quarantineFile!.name), path.join(uploadPath, file.name));
	}

	void generateThumbnails(file.name);

	return res.send({
		message: 'Successfully allowed the file'
	});
};
