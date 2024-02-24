import bcrypt from 'bcryptjs';
import type { FastifyReply } from 'fastify';
import moment from 'moment';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { responseMessageSchema } from '@/structures/schemas/ResponseMessage.js';

export const schema = {
	summary: 'Change password',
	description: 'Change the password of the current user',
	tags: ['Auth'],
	body: z.object({
		password: z.string().describe('The current password of the user.'),
		newPassword: z.string().describe('The new password of the user.')
	}),
	response: {
		200: z.object({
			message: responseMessageSchema
		}),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	url: '/auth/password/change',
	method: 'post',
	middlewares: ['auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { password, newPassword } = req.body as { newPassword?: string; password?: string };

	if (!password || !newPassword) {
		void res.badRequest('Invalid password or newPassword supplied');
		return;
	}

	if (password === newPassword) {
		void res.badRequest('Passwords have to be different');
		return;
	}

	const user = await prisma.users.findUnique({
		where: {
			id: req.user.id
		},
		select: {
			password: true
		}
	});

	const comparePassword = await bcrypt.compare(password, user?.password ?? '');
	if (!comparePassword) {
		void res.unauthorized('Current password is incorrect');
		return;
	}

	if (newPassword.length < 6 || newPassword.length > 64) {
		void res.badRequest('Password must have 6-64 characters');
		return;
	}

	let hash;
	try {
		hash = await bcrypt.hash(newPassword, 10);
	} catch (error) {
		res.log.error(error);
		void res.internalServerError('There was a problem processing your account');
		return;
	}

	const now = moment.utc().toDate();
	await prisma.users.update({
		where: {
			id: req.user.id
		},
		data: {
			password: hash,
			passwordEditedAt: now
		}
	});

	return res.send({ message: 'The password was changed successfully' });
};
