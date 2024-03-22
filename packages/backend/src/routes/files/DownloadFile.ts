import { createReadStream } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';

export const schema = {
	summary: 'Download file',
	description: 'Download a specific file with its original file name',
	tags: ['Files'],
	params: z
		.object({
			uuid: z.string().describe('The uuid of the file.')
		})
		.required(),
	response: {
		200: z.any().describe('The file as a download with its original file name.'),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	url: '/file/:uuid/download',
	method: 'get'
};

export const run = async (req: FastifyRequest, res: FastifyReply) => {
	const { uuid } = req.params as { uuid: string };

	// Make sure the file exists
	const file = await prisma.files.findFirst({
		where: {
			uuid
		},
		select: {
			name: true,
			original: true
		}
	});

	if (!file) {
		void res.notFound('The file could not be found');
		return;
	}

	const uploadPath = fileURLToPath(new URL('../../../../../uploads', import.meta.url));
	const filePath = createReadStream(`${uploadPath}/${file.name}`);
	return res.header('content-disposition', `attachment; filename="${file.original}"`).send(filePath);
};
