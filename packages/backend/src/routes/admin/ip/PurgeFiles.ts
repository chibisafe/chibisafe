import type { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { purgeIpFiles } from '@/utils/File.js';

export const schema = {
	summary: 'Purge files',
	description: 'Purge all files uploaded from an IP address',
	tags: ['Files', 'IP Management'],
	body: z
		.object({
			ip: z.string().describe('The IP address.')
		})
		.required(),
	response: {
		200: z.object({
			message: z.string().describe('The response message.')
		}),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	url: '/admin/ip/files/purge',
	method: 'post',
	middlewares: ['apiKey', 'auth', 'admin']
};

export const run = async (req: FastifyRequest, res: FastifyReply) => {
	const { ip }: { ip: string } = req.body as { ip: string };
	if (!ip) {
		void res.badRequest('No ip provided');
		return;
	}

	await purgeIpFiles(ip);

	return res.send({
		message: "Successfully purged IP's files"
	});
};
