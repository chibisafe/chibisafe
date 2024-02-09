import type { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { getChibisafeVersion } from '@/utils/Util.js';

export const schema = {
	summary: 'Get version',
	description: 'Get the current version of the application',
	tags: ['Server'],
	response: {
		200: z.object({
			version: z.string().describe('The current version of the application.')
		})
	}
};

export const options = {
	url: '/version',
	method: 'get'
};

export const run = (_: FastifyRequest, res: FastifyReply) => {
	return res.send({
		version: getChibisafeVersion()
	});
};
