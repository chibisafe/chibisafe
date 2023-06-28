import type { FastifyRequest, FastifyReply } from 'fastify';
import { rawHTML } from '@/utils/Docs';

export const options = {
	url: '/docs',
	method: 'get',
	ignoreRoutePrefix: true,
	schema: {
		hide: true
	}
};

export const run = (req: FastifyRequest, res: FastifyReply) => {
	void res.type('text/html').send(rawHTML);
};
