import bcrypt from 'bcryptjs';
import type { FastifyRequest, FastifyReply } from 'fastify';
import JWT from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { requestUserSchema } from '@/structures/schemas/RequestUser.js';
import { responseMessageSchema } from '@/structures/schemas/ResponseMessage.js';
import { SETTINGS } from '@/structures/settings.js';

export const schema = {
	summary: 'Login',
	description: 'Login to an existing account',
	tags: ['Auth'],
	headers: z.object({
		invite: z.string().optional().describe('The invite code to use.')
	}),
	body: z
		.object({
			username: z.string().describe('The username of the user.'),
			password: z.string().describe('The password of the user.')
		})
		.required(),
	response: {
		200: z.object({
			message: responseMessageSchema,
			user: requestUserSchema,
			token: z.string().describe('The JWT token.')
		}),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	url: '/auth/login',
	method: 'post',
	options: {
		rateLimit: {
			max: 10, // Ten rquests
			timeWindow: 1000 * 60 // Per minute
		}
	}
};

export const run = async (req: FastifyRequest, res: FastifyReply) => {
	const { username, password } = req.body as { password?: string; username?: string };
	if (!username || !password) {
		void res.unauthorized('No username or password provided');
		return;
	}

	const user = await prisma.users.findFirst({
		where: {
			username
		},
		include: {
			roles: {
				select: {
					name: true
				}
			}
		}
	});

	if (!user) {
		void res.unauthorized('Wrong Username or Password');
		return;
	}

	const comparePassword = await bcrypt.compare(password, user.password);
	if (!comparePassword) {
		void res.unauthorized('Wrong Username or Password');
		return;
	}

	const jwt = JWT.sign(
		{
			iss: 'chibisafe',
			sub: user.id,
			iat: Date.now()
		},
		SETTINGS.secret ?? '',
		{ expiresIn: '30d' }
	);

	const response = {
		message: 'Successfully logged in.',
		user: {
			id: user.id,
			uuid: user.uuid,
			username: user.username,
			roles: user.roles,
			apiKey: user.apiKey,
			passwordEditedAt: user.passwordEditedAt
		},
		token: jwt,
		expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30
	};

	// Support both JSON response and cookies
	return res
		.setCookie('token', jwt, {
			expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
			httpOnly: true,
			path: '/'
		})
		.send(response);
};
