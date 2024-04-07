import type { Prisma } from '@prisma/client';
import type { FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { queryLimitSchema } from '@/structures/schemas/QueryLimit.js';
import { queryPageSchema } from '@/structures/schemas/QueryPage.js';
import { responseMessageSchema } from '@/structures/schemas/ResponseMessage.js';
import { constructSnippetPublicLink } from '@/utils/Snippet.js';

export const schema = {
	summary: 'Get snippets',
	description: 'Return a list of snippets belonging to the user',
	tags: ['Snippets'],
	query: z.object({
		page: queryPageSchema,
		limit: queryLimitSchema,
		search: z.string().optional().describe('The text you want to search within your snippets.')
	}),
	response: {
		200: z.object({
			message: responseMessageSchema,
			snippets: z.array(
				z.object({
					uuid: z.string().describe('The uuid of the snippet.'),
					parentUuid: z.string().nullable().describe('The parent uuid of the snippet if any.'),
					name: z.string().describe('The name of the snippet.'),
					content: z.string().describe('The content of the snippet.'),
					language: z.string().describe('The language of the snippet.'),
					raw: z.string().describe('The direct link to the snippet.'),
					link: z.string().describe('The link to the snippet.'),
					createdAt: z.date().describe('The date the snippet was created.')
				})
			),
			count: z.number().describe('The amount of snippets that exist.')
		}),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	url: '/snippets',
	method: 'get',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { page = 1, limit = 50, search = '' } = req.query as { limit?: number; page?: number; search?: string };

	let dbSearchObject: Prisma.snippetsCountArgs['where'] = {
		userId: req.user.id
	};

	if (search) {
		dbSearchObject = {
			...dbSearchObject,
			name: {
				contains: search
			}
		};
	}

	const count = await prisma.snippets.count({
		where: dbSearchObject
	});

	const snippets = await prisma.snippets.findMany({
		take: limit,
		skip: (page - 1) * limit,
		where: dbSearchObject,
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

	const fetchedSnippets = snippets.map(snippet => ({
		...snippet,
		...constructSnippetPublicLink(req, snippet.identifier)
	}));

	return res.send({
		message: 'Successfully fetched snippets',
		snippets: fetchedSnippets,
		count
	});
};
