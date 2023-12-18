import type { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '@/structures/database.js';

export const options = {
	url: '/admin/ip/list',
	method: 'get',
	middlewares: ['apiKey', 'auth', 'admin']
};

export const run = async (_: FastifyRequest, res: FastifyReply) => {
	const list = await prisma.bans.findMany({
		select: {
			ip: true,
			createdAt: true
		}
	});
	return res.send(list);
};
