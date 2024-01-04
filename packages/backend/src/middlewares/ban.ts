import type { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '@/structures/database.js';

export default async (req: FastifyRequest, res: FastifyReply) => {
	const banned = await prisma.bans.findFirst({
		where: {
			ip: req.ip
		}
	});

	if (banned) {
		void res.forbidden('This IP has been banned');
	}
};
