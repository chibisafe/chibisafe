import type { FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { responseMessageSchema } from '@/structures/schemas/ResponseMessage.js';

export const schema = {
	summary: 'Get public snippet',
	description: 'Get a public snippet',
	tags: ['Snippets'],
	response: {
		200: z.object({
			message: responseMessageSchema,
			snippet: z.object({
				name: z.string().describe('The name of the snippet.'),
				content: z.string().describe('The content of the snippet.'),
				language: z.string().describe('The language of the snippet.')
			})
		}),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

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
