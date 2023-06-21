import type { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '@/structures/database';
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';
import { SETTINGS } from '@/structures/settings';

export const options = {
	url: '/auth/login',
	method: 'post',
	options: {
		rateLimit: {
			max: 3, // Three rquests
			timeWindow: 1000 * 60 // Per minute
		}
	}
};

export const run = async (req: FastifyRequest, res: FastifyReply) => {
	const { username, password } = req.body as { username?: string; password?: string };
	if (!username || !password)
		return res.code(400).send({
			message: 'No username or password provided'
		});

	const user = await prisma.users.findFirst({
		where: {
			username
		}
	});

	if (!user) return res.code(401).send({ message: "User doesn't exist" });

	const comparePassword = await bcrypt.compare(password, user.password);
	if (!comparePassword) return res.code(401).send({ message: 'Wrong password' });

	const jwt = JWT.sign(
		{
			iss: 'chibisafe',
			sub: user.id,
			iat: Date.now()
		},
		SETTINGS.secret ?? '',
		{ expiresIn: '30d' }
	);

	return res.send({
		message: 'Successfully logged in.',
		id: user.id,
		uuid: user.uuid,
		username: user.username,
		apiKey: user.apiKey,
		isAdmin: user.isAdmin,
		token: jwt,
		passwordEditedAt: user.passwordEditedAt
	});
};
