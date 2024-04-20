import type { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { responseMessageSchema } from '@/structures/schemas/ResponseMessage.js';

export const schema = {
	summary: 'Increase public album view count',
	description: 'Incrases the number of times the album was viewed',
	tags: ['Albums'],
	params: z
		.object({
			identifier: z.string().describe('The identifier of the link used to access the album.')
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
	url: '/album/:identifier/view/count',
	method: 'get'
};

export const run = async (req: FastifyRequest, res: FastifyReply) => {
	const { identifier } = req.params as { identifier: string };

	try {
		await prisma.links.update({
			where: {
				identifier
			},
			data: {
				views: {
					increment: 1
				}
			}
		});
	} catch (error: any) {
		void res.internalServerError(error);
		return;
	}

	return res.send({
		message: 'Successfully updated count'
	});
};
