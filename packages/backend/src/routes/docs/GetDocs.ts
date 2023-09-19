import type { FastifyRequest, FastifyReply } from 'fastify';
import { rawHTML } from '@/utils/Docs.js';

export const options = {
	url: '/docs',
	method: 'get',
	ignoreRoutePrefix: true,
	schema: {
		hide: true
	}
};

export const run = (_: FastifyRequest, res: FastifyReply) => {
	void res.type('text/html').send(rawHTML);
};
