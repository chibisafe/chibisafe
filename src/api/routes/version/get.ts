import type { FastifyRequest, FastifyReply } from 'fastify';

export const run = async (req: FastifyRequest, res: FastifyReply) => res.send({
	version: process.env.npm_package_version
});
