import type { FastifyReply } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';

export const schema = {
	summary: 'Create invite',
	description: 'Create an invite to share with people when the chibisafe instance is invite-only',
	tags: ['Invites'],
	response: {
		200: z.object({
			message: z.string().describe('The response message.'),
			code: z.string().describe('The invite code.')
		}),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	url: '/admin/invite/create',
	method: 'post',
	middlewares: ['apiKey', 'auth', 'admin']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const code = uuidv4();
	await prisma.invites.create({
		data: {
			code,
			createdBy: req.user.uuid
		}
	});

	return res.send({
		message: 'Successfully created invite',
		code
	});
};
