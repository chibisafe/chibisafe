import type { FastifyReply } from 'fastify';
import type { RequestWithUser } from '../../structures/interfaces';

export const options = {
	url: '/user/me',
	method: 'get',
	middlewares: ['auth']
};

export const run = (req: RequestWithUser, res: FastifyReply) =>
	res.send({
		message: 'Successfully retrieved user',
		user: {
			...req.user
		}
	});
