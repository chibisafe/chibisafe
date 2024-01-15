import type { FastifyReply } from 'fastify';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { constructSnippetPublicLink } from '@/utils/Snippet.js';

export const options = {
	url: '/snippet/:uuid',
	method: 'get',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid } = req.params as { uuid: string };

	const snippet = await prisma.snippets.findFirst({
		where: {
			userId: req.user.id,
			uuid
		},
		select: {
			content: true,
			language: true,
			name: true,
			description: true,
			parentUuid: true,
			uuid: true,
			identifier: true,
			createdAt: true
		}
	});

	if (!snippet) {
		void res.notFound('The snippet could not be found');
		return;
	}

	return res.send({
		message: 'Successfully fetched snippet',
		snippet: {
			...snippet,
			...constructSnippetPublicLink(req, snippet.identifier)
		}
	});
};
