import type { FastifyReply } from 'fastify';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';

export default async (req: RequestWithUser, res: FastifyReply) => {
	const apiKey = req.headers['x-api-key'] as string;

	if (!apiKey) return;

	const user = await prisma.users.findFirst({
		where: {
			apiKey
		},
		include: {
			roles: {
				select: {
					name: true
				}
			}
		}
	});

	if (!user) {
		void res.unauthorized('Invalid authorization');
		return;
	}

	if (!user.enabled) {
		void res.unauthorized('This account has been disabled');
		return;
	}

	// eslint-disable-next-line require-atomic-updates
	req.user = {
		id: user.id,
		uuid: user.uuid,
		username: user.username,
		roles: user.roles,
		apiKey: user.apiKey,
		passwordEditedAt: user.passwordEditedAt
	};
};
