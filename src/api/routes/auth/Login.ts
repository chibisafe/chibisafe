import type { Request, Response } from 'hyper-express';
import prisma from '../../structures/database';
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';

export const options = {
	url: '/auth/login',
	method: 'post'
};

export const run = async (req: Request, res: Response) => {
	const { username, password } = await req.json();
	if (!username || !password)
		return res.status(400).json({
			message: 'No username or password provided'
		});

	const user = await prisma.users.findFirst({
		where: {
			username
		}
	});

	if (!user) return res.status(401).json({ message: "User doesn't exist" });

	const comparePassword = await bcrypt.compare(password, user.password);
	if (!comparePassword) return res.status(401).json({ message: 'Invalid authorization.' });

	const jwt = JWT.sign(
		{
			iss: 'chibisafe',
			sub: user.id,
			iat: new Date().getTime()
		},
		process.env.JWT_SECRET ?? '',
		{ expiresIn: '30d' }
	);

	return res.json({
		message: 'Successfully logged in.',
		user: {
			id: user.id,
			uuid: user.uuid,
			username: user.username,
			apiKey: user.apiKey,
			isAdmin: user.isAdmin
		},
		token: jwt
	});
};
