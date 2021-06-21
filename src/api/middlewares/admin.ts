import type { FastifyReply, HookHandlerDoneFunction } from 'fastify';
import type { RequestWithUser } from './auth';

export default (req: RequestWithUser, res: FastifyReply, next: HookHandlerDoneFunction) => {
	if (!req.user.isAdmin) return res.status(401).send({ message: 'Permission denied' });
	next();
};
