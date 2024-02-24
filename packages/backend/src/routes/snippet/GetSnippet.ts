import type { FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { responseMessageSchema } from '@/structures/schemas/ResponseMessage.js';
import { constructSnippetPublicLink } from '@/utils/Snippet.js';

export const schema = {
	summary: 'Get snippet',
	description: 'Get a snippet belonging to the user',
	tags: ['Snippets'],
	response: {
		200: z.object({
			message: responseMessageSchema,
			snippet: z.object({
				uuid: z.string().describe('The uuid of the snippet.'),
				parentUuid: z.string().nullable().describe('The parent UUID of the snippet if any.'),
				name: z.string().describe('The name of the snippet.'),
				content: z.string().describe('The content of the snippet.'),
				language: z.string().describe('The language of the snippet.'),
				raw: z.string().describe('The direct link to the snippet.'),
				link: z.string().describe('The link to the snippet.'),
				createdAt: z.date().describe('The date the snippet was created.')
			})
		}),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

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
