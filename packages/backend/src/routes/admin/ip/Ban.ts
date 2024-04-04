import type { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';

export const schema = {
	summary: 'Ban IP',
	description: 'Ban an IP address from using the service',
	tags: ['IP Management'],
	body: z
		.object({
			ip: z.string().describe('The IP address.'),
			reason: z.string().optional().describe('The reason for banning the IP.')
		})
		.required(),
	response: {
		200: z.object({
			message: z.string().describe('The response message.')
		}),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	url: '/admin/ip/ban',
	method: 'post',
	middlewares: ['apiKey', 'auth', 'admin']
};

export const run = async (req: FastifyRequest, res: FastifyReply) => {
	const { ip, reason } = req.body as { ip: string; reason?: string };

	if (!ip) {
		void res.badRequest('No ip provided');
		return;
	}

	const found = await prisma.bans.findFirst({
		where: {
			ip
		}
	});

	if (found) {
		void res.badRequest('IP is already banned');
		return;
	}

	await prisma.bans.create({
		data: {
			ip,
			reason: reason ?? null
		}
	});

	req.log.warn(`IP ${ip} has been banned. Reason: ${reason ?? 'No reason provided'}`);

	return res.send({
		message: 'Successfully banned the ip'
	});
};
