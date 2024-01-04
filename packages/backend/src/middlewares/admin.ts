import type { FastifyReply, HookHandlerDoneFunction } from 'fastify';
import type { RequestWithUser } from '@/structures/interfaces.js';

export default (req: RequestWithUser, res: FastifyReply, next: HookHandlerDoneFunction) => {
	if (!req.user?.roles.some(role => role.name === 'admin')) {
		void res.unauthorized('You need to be an admin to access this resource');
		return;
	}

	next();
};
