import type { Request, Response } from 'hyper-express';
import prisma from '../../structures/database';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import log from '../../utils/Log';

export const options = {
	url: '/auth/register',
	method: 'post'
};

export const run = async (req: Request, res: Response) => {
	const { username, password } = await req.json();
	if (!username || !password)
		return res.status(400).json({
			message: 'No username or password provided'
		});

	if (username.length < 4 || username.length > 32) {
		return res.status(400).json({ message: 'Username must have 4-32 characters' });
	}
	if (password.length < 6 || password.length > 64) {
		return res.status(400).json({ message: 'Password must have 6-64 characters' });
	}

	const exists = await prisma.users.findFirst({
		where: {
			username
		}
	});

	if (exists) return res.status(401).json({ message: 'Username already exists' });

	let hash;
	try {
		hash = await bcrypt.hash(password, 10);
	} catch (err) {
		log.error(err);
		return res.status(401).json({ message: 'There was a problem processing your account' });
	}

	await prisma.users.create({
		data: {
			uuid: uuidv4(),
			username,
			password: hash
		}
	});
	return res.json({ message: 'The account was created successfully' });
};
