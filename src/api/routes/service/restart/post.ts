import type { FastifyReply } from 'fastify';
import type { RequestWithUser } from '../../../structures/interfaces';

export const middlewares = ['auth', 'admin'];

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	void res.send({
		message: 'Successfully triggered restart'
	});
	process.exit(0);
};
