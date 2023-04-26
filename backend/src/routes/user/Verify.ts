import type { FastifyReply } from 'fastify';
import type { RequestWithUser } from '../../structures/interfaces';

export const options = {
	url: '/verify',
	method: 'get',
	middlewares: ['apiKey', 'auth']
};

export const run = (req: RequestWithUser, res: FastifyReply) => res.code(200).send(req.user);
