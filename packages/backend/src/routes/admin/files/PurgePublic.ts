import type { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { purgePublicFiles } from '@/utils/File.js';

export const schema = {
	summary: 'Purge all files',
	description: 'Purges all public files',
	tags: ['Files'],
	response: {
		200: z.object({
			message: z.string().describe('The response message.')
		}),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	url: '/admin/files/purge/public',
	method: 'post',
	middlewares: ['apiKey', 'auth', 'admin']
};

export const run = async (_: FastifyRequest, res: FastifyReply) => {
	await purgePublicFiles();

	return res.send({
		message: "Successfully purged user's files and albums"
	});
};
