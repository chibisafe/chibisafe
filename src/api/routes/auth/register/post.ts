import type { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '../../../structures/database';
import bcrypt from 'bcryptjs';

interface body {
	username: string;
	password: string;
}

export const run = async (req: FastifyRequest, res: FastifyReply) => {
	if (!req.body) return res.status(400).send({ message: 'No body provided' });
	const { username, password } = req.body as body;
	if (!username || !password) return res.status(400).send();

	if (username.length < 4 || username.length > 32) {
		return res.status(400).send({ message: 'Username must have 4-32 characters' });
	}
	if (password.length < 6 || password.length > 64) {
		return res.status(400).send({ message: 'Password must have 6-64 characters' });
	}

	const exists = await prisma.users.findFirst({
		where: {
			username
		}
	});

	if (exists) return res.status(401).send({ message: 'Username already exists' });

	let hash;
	try {
		hash = await bcrypt.hash(password, 10);
	} catch (err) {
		req.log.error(err);
		return res.status(401).send({ message: 'There was a problem processing your account' });
	}

	await prisma.users.create({
		data: {
			username,
			password: hash
		}
	});
	return res.send({ message: 'The account was created successfully' });
};
