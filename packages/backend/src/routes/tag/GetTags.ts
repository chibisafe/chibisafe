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

export const schema = {
	summary: 'Get tags',
	description: 'Return a list of tags belonging to the user',
	tags: ['Tags'],
	query: z.object({
		page: queryPageSchema,
		limit: queryLimitSchema
	}),
	response: {
		200: z.object({
			message: responseMessageSchema,
			tags: z.array(
				z.object({
					uuid: z.string().describe('The uuid of the tag.'),
					name: z.string().describe('The name of the tag.'),
					_count: z
						.object({
							files: z.number().describe('The number of files belonging to the tag.')
						})
						.describe('The number of files belonging to the tag.')
				})
			),
			count: z.number().describe('The amount of tags that exist.')
		}),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	url: '/tags',
	method: 'get',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { page = 1, limit = 50 } = req.query as { limit?: number; page?: number };

	const count = await prisma.tags.count({
		where: {
			userId: req.user.id
		}
	});

	const tags = await prisma.tags.findMany({
		take: limit,
		skip: (page - 1) * limit,
		where: {
			userId: req.user.id
		},
		select: {
			uuid: true,
			name: true,
			_count: {
				select: {
					files: true
				}
			}
		},
		orderBy: {
			id: 'desc'
		}
	});

	return res.send({
		message: 'Successfully fetched tags',
		tags,
		count
	});
};
