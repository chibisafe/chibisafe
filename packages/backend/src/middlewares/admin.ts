import type { FastifyReply, HookHandlerDoneFunction } from 'fastify';
import type { RequestWithUser } from '@/structures/interfaces';

export default (req: RequestWithUser, res: FastifyReply, next: HookHandlerDoneFunction) => {
	if (!req.user?.isAdmin) {
		res.unauthorized('You need to be an admin to access this resource');
		return;
	}

	next();
};
