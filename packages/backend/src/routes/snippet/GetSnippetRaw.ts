import type { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';

export const schema = {
	summary: 'Get raw snippet',
	description: 'Get a raw snippet',
	tags: ['Snippets'],
	response: {
		200: z.string(),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

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
