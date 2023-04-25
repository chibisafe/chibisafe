import type { Response, MiddlewareNext } from 'hyper-express';
import type { RequestWithOptionalUser } from '../structures/interfaces';
import { SETTINGS } from '../structures/settings';
import JWT from 'jsonwebtoken';
import log from '../utils/Log';
import prisma from '../structures/database';
import process from 'node:process';

interface Decoded {
	sub: number;
	iat: number;
}

export default (
	req: RequestWithOptionalUser,
	res: Response,
	next: MiddlewareNext,
	options?: { [index: number | string]: any }
) => {
	if (!req.headers.authorization) {
		if (options?.optional) {
			next();
			return;
		}

		return res.status(401).json({ message: 'No authorization header provided' });
	}

	const token = req.headers.authorization.split(' ')[1];
	if (!token) {
		if (options?.optional) {
			next();
			return;
		}

		return res.status(401).json({ message: 'No authorization header provided' });
	}

	// eslint-disable-next-line @typescript-eslint/no-misused-promises, promise/prefer-await-to-callbacks
	JWT.verify(token, SETTINGS.secret ?? '', async (error, decoded) => {
		if (error) return res.status(401).json({ message: 'Invalid token' });
		const id = (decoded as Decoded | undefined)?.sub ?? null;
		const dateSigned = (decoded as Decoded | undefined)?.iat ?? null;
		if (!id) return res.status(401).json({ message: 'Invalid authorization' });

		const user = await prisma.users.findFirst({
			where: {
				id
			},
			select: {
				id: true,
				uuid: true,
				username: true,
				isAdmin: true,
				apiKey: true,
				passwordEditedAt: true
			}
		});

		if (dateSigned && Number(user?.passwordEditedAt) > dateSigned) {
			return res.status(401).json({ message: 'Token expired' });
		}

		if (!user) return res.status(401).json({ message: "User doesn't exist" });
		req.user = {
			id: user.id,
			uuid: user.uuid,
			username: user.username,
			isAdmin: user.isAdmin,
			apiKey: user.apiKey
		};
		log.debug(`Request from user: ${user.username}`);
		next();
	});
};
