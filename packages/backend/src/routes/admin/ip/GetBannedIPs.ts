import type { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';

export const schema = {
	summary: 'Get banned IPs',
	description: 'Gets all the banned IPs',
	tags: ['IP Management'],
	response: {
		200: z
			.array(
				z.object({
					ip: z.string().describe('The IP address.'),
					createdAt: z.date().describe('The date the IP was banned.')
				})
			)
			.describe('The list of banned IPs.'),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	url: '/admin/ip/list',
	method: 'get',
	middlewares: ['apiKey', 'auth', 'admin']
};

export const run = async (_: FastifyRequest, res: FastifyReply) => {
	const list = await prisma.bans.findMany({
		select: {
			ip: true,
			createdAt: true
		}
	});
	return res.send(list);
};
