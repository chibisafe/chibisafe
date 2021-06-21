import type { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '../../../structures/database';
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';

interface body {
	username: string;
	password: string;
}

export const run = async (req: FastifyRequest, res: FastifyReply) => {
	if (!req.body) return res.status(400).send({ message: 'No body provided' });
	// const { username, password }: { username: string; password: string } = req.body;
	const { username, password } = req.body as body;
	if (!username || !password) return res.status(400).send();

	const user = await prisma.users.findFirst({
		where: {
			username
		}
	});

	if (!user) return res.status(401).send({ message: 'User doesn\'t exist' });

	const comparePassword = await bcrypt.compare(password, user.password ?? '');
	if (!comparePassword) return res.status(401).send({ message: 'Invalid authorization.' });

	const jwt = JWT.sign({
		iss: 'chibisafe',
		sub: user.id,
		iat: new Date().getTime()
	}, process.env.secret ?? '', { expiresIn: '30d' });

	return res.send({
		message: 'Successfully logged in.',
		user: {
			id:	user.id,
			username: user.username,
			apiKey: user.apiKey,
			isAdmin: user.isAdmin
		},
		token: jwt
	});
};
