import type { FastifyReply, HookHandlerDoneFunction } from 'fastify';
import type { RequestWithUser } from '@/structures/interfaces.js';

export default (req: RequestWithUser, res: FastifyReply, next: HookHandlerDoneFunction) => {
	if (!req.user?.roles.some(role => role.name === 'owner')) {
		void res.unauthorized('You need to be the owner of the instance to access this resource');
		return;
	}

	next();
};
