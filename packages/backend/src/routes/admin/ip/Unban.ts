import type { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';

export const schema = {
	summary: 'Unban IP',
	description: 'Unban an IP address',
	tags: ['IP Management'],
	body: z
		.object({
			ip: z.string().describe('The IP address.')
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
	url: '/admin/ip/unban',
	method: 'post',
	middlewares: ['apiKey', 'auth', 'admin']
};

export const run = async (req: FastifyRequest, res: FastifyReply) => {
	const { ip }: { ip: string } = req.body as { ip: string };

	if (!ip) {
		void res.badRequest('No ip provided');
		return;
	}

	const record = await prisma.bans.findFirst({
		where: {
			ip
		}
	});

	if (!record) {
		void res.badRequest('IP is not banned');
		return;
	}

	if (record) {
		await prisma.bans.delete({
			where: {
				id: record.id
			}
		});
	}

	res.log.warn(`IP ${ip} has been unbanned`);

	return res.send({
		message: 'Successfully unbanned the ip'
	});
};
