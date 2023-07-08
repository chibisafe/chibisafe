import type { FastifyReply, HookHandlerDoneFunction } from 'fastify';
import type { RequestWithOptionalUser } from '@/structures/interfaces';
import { SETTINGS } from '@/structures/settings';
import JWT from 'jsonwebtoken';
import prisma from '@/structures/database';

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

		res.unauthorized('No authorization header provided');
		return;
	}

	const token = req.headers.authorization.split(' ')[1];
	if (!token) {
		if (options?.optional) {
			next();
			return;
		}

		res.unauthorized('No authorization header provided');
		return;
	}

	// eslint-disable-next-line @typescript-eslint/no-misused-promises, promise/prefer-await-to-callbacks
	JWT.verify(token, SETTINGS.secret ?? '', async (error, decoded) => {
		if (error) {
			res.unauthorized('Invalid token');
			return;
		}

		const id = (decoded as Decoded | undefined)?.sub ?? null;
		const dateSigned = (decoded as Decoded | undefined)?.iat ?? null;
		if (!id) {
			res.unauthorized('Invalid authorization');
			return;
		}

		const user = await prisma.users.findFirst({
			where: {
				id
			},
			select: {
				id: true,
				uuid: true,
				username: true,
				enabled: true,
				apiKey: true,
				passwordEditedAt: true,
				roles: {
					select: {
						name: true
					}
				}
			}
		});

		if (dateSigned && Number(user?.passwordEditedAt) > dateSigned) {
			res.unauthorized('Token expired');
			return;
		}

		if (!user) {
			res.unauthorized("User doesn't exist");
			return;
		}

		if (!user.enabled) {
			res.forbidden('User is disabled');
			return;
		}

		req.user = {
			id: user.id,
			uuid: user.uuid,
			username: user.username,
			roles: user.roles,
			apiKey: user.apiKey,
			passwordEditedAt: user.passwordEditedAt
		};
		req.log.debug(`Request from user: ${user.username}`);
		next();
	});
};
