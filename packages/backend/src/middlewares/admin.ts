import type { FastifyReply, HookHandlerDoneFunction } from 'fastify';
import type { RequestWithUser } from '@/structures/interfaces';

export default (req: RequestWithUser, res: FastifyReply, next: HookHandlerDoneFunction) => {
	if (!req.user?.isAdmin) {
		return res.code(401).send({ message: 'You need to be an admin to access this resource' });
	}

	next();
};
