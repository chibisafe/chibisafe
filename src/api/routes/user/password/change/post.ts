import type { FastifyReply } from 'fastify';
import type { RequestWithUser } from '../../../../structures/interfaces';
import prisma from '../../../../structures/database';
import bcrypt from 'bcryptjs';
import { utc } from 'moment';

interface body {
	password: string;
	newPassword: string;
}

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	if (!req.body) return res.status(400).send({ message: 'No body provided' });
	const { password, newPassword } = req.body as body;
	if (!password || !newPassword) return res.status(400).send({ message: 'Invalid body provided' });
	if (password === newPassword) return res.status(400).send({ message: 'Passwords have to be different' });

	const user = await prisma.users.findUnique({
		where: {
			id: req.user.id
		},
		select: {
			password: true
		}
	});

	const comparePassword = await bcrypt.compare(password, user?.password ?? '');
	if (!comparePassword) return res.status(401).send({ message: 'Current password is incorrect' });

	if (newPassword.length < 6 || newPassword.length > 64) {
		return res.status(400).send({ message: 'Password must have 6-64 characters' });
	}

	let hash;
	try {
		hash = await bcrypt.hash(newPassword, 10);
	} catch (err) {
		req.log.error(err);
		return res.status(401).send({ message: 'There was a problem processing your account' });
	}

	const now = utc().toDate();
	await prisma.users.update({
		where: {
			id: req.user.id
		},
		data: {
			password: hash,
			passwordEditedAt: now
		}
	});

	return res.send({ message: 'TThe password was changed successfully' });
};
