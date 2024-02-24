import type { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { responseMessageSchema } from '@/structures/schemas/ResponseMessage.js';
import { userAsAdminSchema } from '@/structures/schemas/UserAsAdmin.js';

export const schema = {
	summary: 'Get user',
	description: 'Get a user',
	tags: ['User Management'],
	params: z
		.object({
			uuid: z.string().describe('The uuid of the user.')
		})
		.required(),
	response: {
		200: z.object({
			message: responseMessageSchema,
			user: userAsAdminSchema.extend({
				apiKeyEditedAt: z.date().describe('The date the user last edited their API key.')
			})
		}),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	url: '/admin/user/:uuid',
	method: 'get',
	middlewares: ['apiKey', 'auth', 'admin']
};

export const run = async (req: FastifyRequest, res: FastifyReply) => {
	const { uuid } = req.params as { uuid?: string };
	if (!uuid) {
		void res.badRequest('Invalid uuid supplied');
		return;
	}

	const user = await prisma.users.findUnique({
		where: {
			uuid
		},
		select: {
			uuid: true,
			username: true,
			enabled: true,
			roles: {
				select: {
					name: true
				}
			},
			createdAt: true,
			editedAt: true,
			apiKeyEditedAt: true
		}
	});

	if (!user) {
		void res.badRequest('User not found');
		return;
	}

	return res.send({
		message: 'Successfully retrieved user',
		user
	});
};
