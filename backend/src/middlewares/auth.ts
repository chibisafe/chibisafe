import type { FastifyReply, HookHandlerDoneFunction } from 'fastify';
import type { RequestWithOptionalUser } from '../structures/interfaces';
import { SETTINGS } from '../structures/settings';
import JWT from 'jsonwebtoken';
import log from '../utils/Log';
import prisma from '../structures/database';

interface Decoded {
	sub: number;
	iat: number;
}

export default (
	req: RequestWithOptionalUser,
	res: FastifyReply,
	next: HookHandlerDoneFunction,
	options?: { [index: number | string]: any }
) => {
	// We already authed in the apiKey middleware
	if (req.user && req.headers['x-api-key']) {
		next();
		return;
	}

	if (!req.headers.authorization) {
		if (options?.optional) {
			next();
			return;
		}

		return res.code(401).send({ message: 'No authorization header provided' });
	}

	const token = req.headers.authorization.split(' ')[1];
	if (!token) {
		if (options?.optional) {
			next();
			return;
		}

		return res.code(401).send({ message: 'No authorization header provided' });
	}

	// eslint-disable-next-line @typescript-eslint/no-misused-promises, promise/prefer-await-to-callbacks
	JWT.verify(token, SETTINGS.secret ?? '', async (error, decoded) => {
		if (error) return res.code(401).send({ message: 'Invalid token' });
		const id = (decoded as Decoded | undefined)?.sub ?? null;
		const dateSigned = (decoded as Decoded | undefined)?.iat ?? null;
		if (!id) return res.code(401).send({ message: 'Invalid authorization' });

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
			return res.code(401).send({ message: 'Token expired' });
		}

		if (!user) return res.code(401).send({ message: "User doesn't exist" });
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
