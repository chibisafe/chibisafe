import type { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';
import prisma from '@/structures/database';

export default async (req: FastifyRequest, res: FastifyReply) => {
	const banned = await prisma.bans.findFirst({
		where: {
			ip: req.ip
		}
	});

	if (banned) {
		res.forbidden('This IP has been banned');
	}
};
