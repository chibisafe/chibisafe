import type { Prisma } from '@prisma/client';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { queryLimitSchema } from '@/structures/schemas/QueryLimit.js';
import { queryPageSchema } from '@/structures/schemas/QueryPage.js';
import { responseMessageSchema } from '@/structures/schemas/ResponseMessage.js';

export const schema = {
	summary: 'Get banned IPs',
	description: 'Gets all the banned IPs',
	tags: ['IP Management'],
	query: z.object({
		page: queryPageSchema,
		limit: queryLimitSchema,
		search: z.string().optional().describe('The text you want to search within your files.')
	}),
	response: {
		200: z.object({
			message: responseMessageSchema,
			ips: z
				.array(
					z.object({
						ip: z.string().describe('The IP address.'),
						reason: z.string().nullish().describe('The reason for banning the IP.'),
						createdAt: z.date().describe('The date the IP was banned.')
					})
				)
				.describe('The list of banned IPs.'),
			count: z.number().describe('The amount of banned ips.')
		}),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	url: '/admin/ip/list',
	method: 'get',
	middlewares: ['apiKey', 'auth', 'admin']
};

export const run = async (req: FastifyRequest, res: FastifyReply) => {
	const { page = 1, limit = 50, search = '' } = req.query as { limit?: number; page?: number; search?: string };

	let dbSearchObject: Prisma.bansCountArgs['where'] = {};

	if (search) {
		dbSearchObject = {
			...dbSearchObject,
			ip: {
				contains: search
			}
		};
	}

	const count = await prisma.bans.count({
		where: dbSearchObject
	});

	const ips = await prisma.bans.findMany({
		take: limit,
		skip: (page - 1) * limit,
		where: dbSearchObject,
		select: {
			ip: true,
			reason: true,
			createdAt: true
		},
		orderBy: {
			createdAt: 'desc'
		}
	});

	return res.send({
		message: 'Successfully retrieved banned ips',
		ips,
		count
	});
};
