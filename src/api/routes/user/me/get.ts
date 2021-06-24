import type { FastifyReply } from 'fastify';
import type { RequestWithUser } from '../../../structures/interfaces';

export const middlewares = ['auth'];

export const run = async (req: RequestWithUser, res: FastifyReply) => res.send({
	message: 'Successfully retrieved user',
	user: {
		...req.user
	}
});
