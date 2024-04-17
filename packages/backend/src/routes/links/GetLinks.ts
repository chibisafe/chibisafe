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
import { constructShortLink } from '@/utils/Link.js';

export const schema = {
	summary: 'Get links',
	description: 'Get a list of created links',
	tags: ['Links'],
	query: z.object({
		page: queryPageSchema,
		limit: queryLimitSchema,
		search: z.string().optional().describe('The text you want to search within your albums.')
	}),
	response: {
		200: z.object({
			message: responseMessageSchema,
			links: z.array(
				z.object({
					uuid: z.string().describe('The uuid of the link.'),
					identifier: z.string().describe('The identifier of the link.'),
					link: z.string().describe('The shortened link.'),
					destination: z.string().describe('The destination of the link.'),
					views: z.number().describe('The amount of views the link has.'),
					createdAt: z.date().describe('The date and time the link was created.')
				})
			),
			count: z.number().describe('The amount of links that exist.')
		}),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	url: '/links',
	method: 'get',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { page = 1, limit = 50, search = '' } = req.query as { limit?: number; page?: number; search?: string };

	let dbSearchObject: Prisma.shortenedLinksCountArgs['where'] = {
		userId: req.user.id
	};

	if (search) {
		dbSearchObject = {
			...dbSearchObject,
			OR: [
				{
					destination: {
						contains: search
					}
				},
				{
					identifier: {
						contains: search
					}
				}
			]
		};
	}

	const count = await prisma.shortenedLinks.count({ where: dbSearchObject });
	const links = await prisma.shortenedLinks.findMany({
		take: limit,
		skip: (page - 1) * limit,
		where: dbSearchObject,
		select: {
			destination: true,
			createdAt: true,
			identifier: true,
			uuid: true,
			views: true
		}
	});

	return res.send({
		message: 'Successfully retrieved links',
		links: links.map(link => ({
			...link,
			link: constructShortLink(req, link.identifier)
		})),
		count
	});
};
