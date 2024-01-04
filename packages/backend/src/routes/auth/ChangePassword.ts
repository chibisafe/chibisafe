import bcrypt from 'bcryptjs';
import type { FastifyReply } from 'fastify';
import moment from 'moment';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';

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
