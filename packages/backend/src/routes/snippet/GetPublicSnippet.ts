import type { FastifyReply } from 'fastify';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';

export const options = {
	url: '/snippet/public/:identifier',
	method: 'get'
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { identifier } = req.params as { identifier: string };

	const snippet = await prisma.snippets.findFirst({
		where: {
			identifier
		},
		select: {
			content: true,
			language: true,
			name: true
		}
	});

	if (!snippet) {
		void res.notFound('The snippet could not be found');
		return;
	}

	return res.send({
		message: 'Successfully fetched snippet',
		snippet
	});
};
