import type { FastifyReply } from 'fastify';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { constructSnippetPublicLink } from '@/utils/Snippet.js';

export const options = {
	url: '/snippets',
	method: 'get',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const snippets = await prisma.snippets.findMany({
		where: {
			userId: req.user.id
		},
		select: {
			content: true,
			language: true,
			name: true,
			parentUuid: true,
			uuid: true,
			identifier: true,
			createdAt: true
		},
		orderBy: {
			createdAt: 'desc'
		}
	});

	return res.send({
		message: 'Successfully fetched snippets',
		snippets: snippets.map(snippet => ({
			...snippet,
			...constructSnippetPublicLink(req, snippet.identifier)
		}))
	});
};
