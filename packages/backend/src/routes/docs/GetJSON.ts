import type { FastifyRequest, FastifyReply } from 'fastify';

export const options = {
	url: '/docs/json',
	method: 'get',
	ignoreRoutePrefix: true,
	schema: {
		hide: true
	}
};

export const run = (req: FastifyRequest, res: FastifyReply) => {
	// @ts-ignore
	void res.send(req.server.swagger());
};
