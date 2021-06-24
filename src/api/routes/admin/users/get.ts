import type { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '../../../structures/database';

export const middlewares = ['auth', 'admin'];

export const run = async (req: FastifyRequest, res: FastifyReply) => {
	const users = await prisma.users.findMany({
		select: {
			id: true,
			username: true,
			enabled: true,
			isAdmin: true,
			createdAt: true
		}
	});

	return res.send({
		message: 'Successfully retrieved users',
		users
	});
};
