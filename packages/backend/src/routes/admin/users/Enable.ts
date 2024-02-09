import type { FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { responseMessageSchema } from '@/structures/schemas/ResponseMessage.js';

export const schema = {
	summary: 'Enable user',
	description: 'Enable a user account',
	tags: ['User Management'],
	params: z
		.object({
			uuid: z.string().describe('The uuid of the user.')
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
	url: '/admin/user/:uuid/enable',
	method: 'post',
	middlewares: ['apiKey', 'auth', 'admin']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid } = req.params as { uuid?: string };
	if (!uuid) {
		void res.badRequest('Invalid uuid supplied');
		return;
	}

	if (uuid === req.user.uuid) {
		void res.badRequest("You can't apply this action to yourself");
		return;
	}

	const user = await prisma.users.findUnique({
		where: {
			uuid
		},
		include: {
			roles: {
				select: {
					name: true
				}
			}
		}
	});

	if (
		user?.roles.some(role => role.name === 'admin' || role.name === 'owner') &&
		!req.user.roles.some(role => role.name === 'owner')
	) {
		void res.badRequest('You cannot enable another admin or owner');
		return;
	}

	if (user?.enabled) {
		void res.badRequest('User is already enabled');
		return;
	}

	await prisma.users.update({
		where: {
			uuid
		},
		data: {
			enabled: true
		}
	});

	return res.send({
		message: 'Successfully enabled user'
	});
};
