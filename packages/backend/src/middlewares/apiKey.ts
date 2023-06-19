import type { FastifyReply, HookHandlerDoneFunction } from 'fastify';
import type { RequestWithUser } from '@/structures/interfaces';
import prisma from '@/structures/database';

export default async (
	req: RequestWithUser,
	res: FastifyReply,
	next: HookHandlerDoneFunction,
	options?: { [index: number | string]: any }
) => {
	const apiKey = req.headers['x-api-key'] as string;

	if (!apiKey && options?.optional) {
		next();
		return;
	}

	if (!apiKey) return;

	const user = await prisma.users.findFirst({
		where: {
			apiKey
		}
	});

	if (!user) return res.code(401).send({ message: 'Invalid authorization' });
	if (!user.enabled) return res.code(401).send({ message: 'This account has been disabled' });

	// eslint-disable-next-line require-atomic-updates
	req.user = user;
};
