import type { FastifyReply } from 'fastify';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { responseMessageSchema } from '@/structures/schemas/ResponseMessage.js';
import { constructSnippetPublicLink, getUniqueSnippetIdentifier } from '@/utils/Snippet.js';

export const schema = {
	summary: 'Create snippet',
	description: 'Create a new snippet',
	tags: ['Snippets'],
	body: z.object({
		name: z.string().optional().describe('The name of the snippet.'),
		content: z.string().describe('The content of the snippet.'),
		language: z.string().optional().describe('The language of the snippet.')
	}),
	response: {
		200: z.object({
			message: responseMessageSchema,
			snippet: z.object({
				uuid: z.string().describe('The uuid of the snippet.'),
				raw: z.string().describe('The raw link to the snippet.'),
				link: z.string().describe('The link to the snippet.')
			})
		}),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	url: '/snippet/create',
	method: 'post',
	middlewares: [
		{
			name: 'apiKey'
		},
		{
			name: 'auth',
			optional: true
		}
	]
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { name, content, language } = req.body as { content: string; language: string; name: string };

	const now = moment.utc().toDate();
	const uniqueIdentifier = await getUniqueSnippetIdentifier();
	if (!uniqueIdentifier) {
		void res.internalServerError('Couldnt allocate identifier for snippet');
		return;
	}

	const snippet = await prisma.snippets.create({
		data: {
			name,
			content,
			language,
			identifier: uniqueIdentifier,
			parentUuid: null,
			userId: req.user?.id,
			uuid: uuidv4(),
			createdAt: now,
			editedAt: now
		}
	});

	const publicLink = constructSnippetPublicLink(req, uniqueIdentifier);

	return res.send({
		message: 'Successfully created snippet',
		snippet: {
			uuid: snippet.uuid,
			...publicLink
		}
	});
};
