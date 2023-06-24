import type { FastifyReply, HookHandlerDoneFunction } from 'fastify';
import type { RequestWithUser } from '@/structures/interfaces';
import prisma from '@/structures/database';

export default async (req: RequestWithUser, res: FastifyReply, next: HookHandlerDoneFunction) => {
	const apiKey = req.headers['x-api-key'] as string;

	if (!apiKey) return;

	const user = await prisma.users.findFirst({
		where: {
			apiKey
		}
	});

	if (!user) {
		res.unauthorized('Invalid authorization');
		return;
	}

	if (!user.enabled) {
		res.unauthorized('This account has been disabled');
		return;
	}

	// eslint-disable-next-line require-atomic-updates
	req.user = {
		id: user.id,
		uuid: user.uuid,
		username: user.username,
		isAdmin: user.isAdmin,
		apiKey: user.apiKey,
		passwordEditedAt: user.passwordEditedAt
	};
};
