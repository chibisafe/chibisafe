import type { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export const schema = {
	summary: 'Get application health status',
	description: 'Get the current health status of the application',
	tags: ['Server'],
	response: {
		200: z.object({
			status: z.string().describe('The current health status of the application.')
		})
	}
};

export const options = {
	url: '/health',
	method: 'get'
};

export const run = (_: FastifyRequest, res: FastifyReply) => {
	return res.send({
		status: 'yes'
	});
};
