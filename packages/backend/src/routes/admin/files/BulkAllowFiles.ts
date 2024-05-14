import path from 'node:path';
import { CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import type { FastifyReply } from 'fastify';
import jetpack from 'fs-jetpack';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { responseMessageSchema } from '@/structures/schemas/ResponseMessage.js';
import { SETTINGS } from '@/structures/settings.js';
import { quarantinePath, uploadPath } from '@/utils/File.js';
import { generateThumbnails } from '@/utils/Thumbnails.js';

export const schema = {
	summary: 'Unquarantine files',
	description: 'Removes the quarantine status from the provided files',
	tags: ['Files', 'Bulk'],
	body: z.object({
		files: z.array(z.string()).optional().nullable().default([])
	}),
	response: {
		200: z.object({
			message: responseMessageSchema
		}),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	url: '/admin/files/allow',
	method: 'post',
	middlewares: ['apiKey', 'auth', 'admin']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { files } = req.body as z.infer<typeof schema.body>;

	if (!files?.length) {
		void res.badRequest('No file uuids provided');
		return;
	}

	const dbFiles = await prisma.files.findMany({
		where: {
			uuid: {
				in: files
			},
			quarantine: true
		},
		select: {
			uuid: true,
			name: true,
			quarantine: true,
			quarantineFile: true,
			isS3: true,
			isWatched: true
		}
	});

	if (!files.length) {
		void res.notFound('No files found to unquarantine');
		return;
	}

	for (const file of dbFiles) {
		if (file.isWatched) {
			continue;
		}

		if (file.isS3) {
			const { createS3Client } = await import('@/structures/s3.js');
			const S3Client = createS3Client();

			const copyCommand = new CopyObjectCommand({
				Bucket: SETTINGS.S3Bucket,
				Key: file.name,
				CopySource: `${SETTINGS.S3Bucket}/quarantine/${file.quarantineFile!.name}`
			});
			const removeCommand = new DeleteObjectCommand({
				Bucket: SETTINGS.S3Bucket,
				Key: `quarantine/${file.quarantineFile!.name}`
			});

			await S3Client.send(copyCommand);
			await S3Client.send(removeCommand);
		}

		await prisma.files.update({
			where: {
				uuid: file.uuid
			},
			data: {
				quarantine: false,
				quarantineFile: {
					delete: true
				}
			}
		});

		if (!file.isS3) {
			await jetpack.moveAsync(
				path.join(quarantinePath, file.quarantineFile!.name),
				path.join(uploadPath, file.name)
			);
		}

		void generateThumbnails({ filename: file.name, tmp: file.isS3, watched: file.isWatched });
	}

	return res.send({
		message: 'Successfully allowed files'
	});
};
