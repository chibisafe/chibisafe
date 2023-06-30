import type { FastifyRequest, FastifyReply } from 'fastify';
import { getChibisafeVersion } from '@/utils/Util';

export const options = {
	url: '/version',
	method: 'get'
};

export const run = (req: FastifyRequest, res: FastifyReply) => {
	return res.send({
		version: getChibisafeVersion()
	});
};
