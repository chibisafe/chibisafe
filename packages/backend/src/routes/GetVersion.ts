import type { FastifyRequest, FastifyReply } from 'fastify';
import { getChibisafeVersion } from '@/utils/Util.js';

export const options = {
	url: '/version',
	method: 'get'
};

export const run = (_: FastifyRequest, res: FastifyReply) => {
	return res.send({
		version: getChibisafeVersion()
	});
};
