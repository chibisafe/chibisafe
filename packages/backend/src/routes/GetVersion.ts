import type { FastifyRequest, FastifyReply } from 'fastify';
import process from 'node:process';

export const options = {
	url: '/version',
	method: 'get'
};

export const run = (req: FastifyRequest, res: FastifyReply) => {
	return res.send({
		version: process.env.npm_package_version
	});
};

export const schema = {
	description: 'Get the current version of the application.',
	tags: ['Server'],
	response: {
		200: {
			type: 'object',
			properties: {
				version: {
					type: 'string',
					description: 'The current version of the application.',
					example: '1.0.0'
				}
			}
		}
	}
};
