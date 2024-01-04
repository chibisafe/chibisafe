import type { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '@/structures/database.js';

export const options = {
	url: '/admin/user/:uuid',
	method: 'get',
	middlewares: ['apiKey', 'auth', 'admin']
};

export const run = async (req: FastifyRequest, res: FastifyReply) => {
	const { uuid } = req.params as { uuid?: string };
	if (!uuid) {
		void res.badRequest('Invalid uuid supplied');
		return;
	}

	const user = await prisma.users.findUnique({
		where: {
			uuid
		},
		select: {
			uuid: true,
			username: true,
			enabled: true,
			roles: {
				select: {
					name: true
				}
			},
			createdAt: true,
			editedAt: true,
			apiKeyEditedAt: true
		}
	});

	if (!user) {
		void res.badRequest('User not found');
		return;
	}

	return res.send({
		message: 'Successfully retrieved user',
		user
	});
};
