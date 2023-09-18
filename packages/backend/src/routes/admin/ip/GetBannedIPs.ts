import type { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '@/structures/database';

export const options = {
	url: '/admin/ip/list',
	method: 'get',
	middlewares: ['auth', 'admin']
};

export const run = async (req: FastifyRequest, res: FastifyReply) => {
	const list = await prisma.bans.findMany({
		select: {
			ip: true,
			createdAt: true
		}
	});
	return res.send(list);
};
