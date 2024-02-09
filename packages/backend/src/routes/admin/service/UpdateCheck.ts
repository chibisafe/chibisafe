import type { FastifyReply } from 'fastify';
import { z } from 'zod';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { updateCheck } from '@/utils/UpdateCheck.js';

export const schema = {
	summary: 'Check for updates',
	description: 'Check if there is a new version of Chibisafe available',
	tags: ['Server'],
	response: {
		200: z.object({
			updateAvailable: z.boolean().describe('Whether or not an update is available'),
			latestVersion: z.string().describe('The latest version of Chibisafe'),
			latestVersionUrl: z.string().describe('The URL to the latest version of Chibisafe'),
			releaseNotes: z
				.array(
					z.object({
						version: z.string().describe('The version of Chibisafe'),
						url: z.string().describe('The URL to the release'),
						name: z.string().describe('The name of the release'),
						body: z.string().describe('The release notes')
					})
				)
				.describe('The release notes for the latest version of Chibisafe')
		}),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	url: '/admin/service/updateCheck',
	method: 'get',
	middlewares: ['apiKey', 'auth', 'admin']
};

export const run = async (_: RequestWithUser, res: FastifyReply) => {
	return res.send(updateCheck);
};
