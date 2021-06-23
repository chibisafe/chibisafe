import type { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';
import prisma from '../structures/database';

export interface RequestWithUser extends FastifyRequest {
	user: {
		id: number;
		username: string | null;
		isAdmin: boolean | null;
	};
}

export default async (req: RequestWithUser, res: FastifyReply, next: HookHandlerDoneFunction) => {
	// TODO: Search for canApiKey in the codebase and add this file as middleware on those, before auth
	const token = req.headers.token as string;
	if (!token) return next();
	const user = await prisma.users.findFirst({
		where: {
			apiKey: token
		}
	});

	if (!user) return res.status(401).send({ message: 'Invalid authorization' });
	if (!user.enabled) return res.status(401).send({ message: 'This account has been disabled' });

	req.user = user;
	next();
};
