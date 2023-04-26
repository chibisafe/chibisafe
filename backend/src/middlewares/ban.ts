import type { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';
import prisma from '../structures/database';

export default async (req: FastifyRequest, res: FastifyReply) => {
	const banned = await prisma.bans.findFirst({
		where: {
			ip: req.ip
		}
	});

	if (banned) {
		return res.code(401).send({ message: 'This IP has been banned' });
	}
};
