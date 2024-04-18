import type { FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { responseMessageSchema } from '@/structures/schemas/ResponseMessage.js';

export const schema = {
	summary: 'Delete link',
	description: 'Deletes a link',
	tags: ['Links'],
	params: z
		.object({
			identifier: z.string().describe('The identifier of the link.')
		})
		.required(),
	response: {
		200: z.object({
			message: responseMessageSchema
		}),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	url: '/admin/link/:identifier',
	method: 'delete',
	middlewares: ['apiKey', 'auth', 'admin']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { identifier } = req.params as { identifier: string };

	const link = await prisma.shortenedLinks.findFirst({
		where: {
			identifier
		},
		select: {
			identifier: true
		}
	});

	if (!link) {
		void res.badRequest("The shortened link doesn't exist");
		return;
	}

	await prisma.shortenedLinks.delete({
		where: {
			identifier
		}
	});

	return res.send({
		message: 'Successfully deleted shortened link'
	});
};
