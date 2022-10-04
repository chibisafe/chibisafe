import type { Response } from 'hyper-express';
import type { RequestWithUser } from '../../structures/interfaces';
import prisma from '../../structures/database';
import bcrypt from 'bcryptjs';
import { utc } from 'moment';
import log from '../../utils/Log';

export const options = {
	url: '/auth/password/change',
	method: 'post',
	middlewares: ['auth']
};

export const run = async (req: RequestWithUser, res: Response) => {
	const { password, newPassword } = await req.json();
	if (!password || !newPassword) return res.status(400).json({ message: 'Invalid body provided' });
	if (password === newPassword) return res.status(400).json({ message: 'Passwords have to be different' });

	const user = await prisma.users.findUnique({
		where: {
			id: req.user.id
		},
		select: {
			password: true
		}
	});

	const comparePassword = await bcrypt.compare(password, user?.password ?? '');
	if (!comparePassword) return res.status(401).json({ message: 'Current password is incorrect' });

	if (newPassword.length < 6 || newPassword.length > 64) {
		return res.status(400).json({ message: 'Password must have 6-64 characters' });
	}

	let hash;
	try {
		hash = await bcrypt.hash(newPassword, 10);
	} catch (err) {
		log.error(err);
		return res.status(401).json({ message: 'There was a problem processing your account' });
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

	return res.json({ message: 'TThe password was changed successfully' });
};
