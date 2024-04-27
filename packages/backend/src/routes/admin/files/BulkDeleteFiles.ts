import type { FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { responseMessageSchema } from '@/structures/schemas/ResponseMessage.js';
import { deleteFiles } from '@/utils/File.js';

export const schema = {
	summary: 'Delete files',
	description: 'Deletes all the provided files as admin',
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
	url: '/admin/files/delete',
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
			}
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
		void res.notFound('No files found to delete');
		return;
	}

	// Delete files from the DB
	await prisma.files.deleteMany({
		where: {
			uuid: {
				in: files
			}
		}
	});

	await deleteFiles({ files: dbFiles });

	return res.send({
		message: 'Successfully deleted files'
	});
};
