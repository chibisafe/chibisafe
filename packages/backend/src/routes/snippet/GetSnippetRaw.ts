import type { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '@/structures/database.js';

export const options = {
	url: '/snippet/:identifier/raw',
	method: 'get'
};

export const run = async (req: FastifyRequest, res: FastifyReply) => {
	const { identifier } = req.params as { identifier: string };

	const snippet = await prisma.snippets.findFirst({
		where: {
			identifier
		},
		select: {
			content: true
		}
	});

	if (!snippet) {
		void res.notFound('The snippet could not be found');
		return;
	}

	return res.send(snippet.content);
};
