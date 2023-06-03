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
