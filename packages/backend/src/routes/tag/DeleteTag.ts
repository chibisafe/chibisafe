import type { FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { responseMessageSchema } from '@/structures/schemas/ResponseMessage.js';

export const schema = {
	summary: 'Delete tag',
	description: 'Delete a tag',
	tags: ['Tags'],
	params: z
		.object({
			uuid: z.string().describe('The uuid of the tag.')
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
	url: '/tag/:uuid',
	method: 'delete',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid } = req.params as { uuid?: string };
	if (!uuid) {
		void res.badRequest('No uuid provided');
		return;
	}

	const tag = await prisma.tags.findFirst({
		where: {
			userId: req.user.id,
			uuid
		}
	});

	if (!tag) {
		void res.notFound("The tag doesn't exist or doesn't belong to the user");
		return;
	}

	await prisma.tags.delete({
		where: {
			uuid
		}
	});

	return res.send({
		message: 'Successfully deleted the tag'
	});
};
