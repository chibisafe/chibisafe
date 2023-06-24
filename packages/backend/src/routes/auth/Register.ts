import type { FastifyRequest, FastifyReply } from 'fastify';
import type { RouteOptions } from '@/structures/interfaces';
import prisma from '@/structures/database';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { SETTINGS } from '@/structures/settings';
import { utc } from 'moment';

export const options = {
	url: '/auth/register',
	method: 'post',
	options: {
		rateLimit: {
			max: 3, // Three rquests
			timeWindow: 1000 * 60 // Per minute
		}
	}
} as RouteOptions;

export const run = async (req: FastifyRequest, res: FastifyReply) => {
	let foundInvite = null;

	const invite = req.headers.invite as string;

	// If new account creation is deactivated then check for an invite
	if (!SETTINGS.userAccounts && !invite) {
		res.unauthorized('Creation of new accounts is currently disabled without an invite');
		return;
	}

	if (invite) {
		// Check if the invite is valid has not been used yet
		foundInvite = await prisma.invites.findFirst({
			where: {
				code: invite,
				used: false
			}
		});

		// If no invite was found then reject the call
		if (!foundInvite) {
			res.unauthorized('Invalid invite code');
			return;
		}
	}

	const { username, password } = req.body as { username?: string; password?: string };
	if (!username || !password) {
		res.badRequest('No username or password provided');
		return;
	}

	if (username.length < 4 || username.length > 32) {
		res.badRequest('Username must have 4-32 characters');
		return;
	}

	if (password.length < 6 || password.length > 64) {
		res.badRequest('Password must have 6-64 characters');
		return;
	}

	const exists = await prisma.users.findFirst({
		where: {
			username
		}
	});

	if (exists) {
		res.badRequest('Username already exists');
		return;
	}

	let hash;
	try {
		hash = await bcrypt.hash(password, 10);
	} catch (error) {
		res.log.error(error);
		res.internalServerError('There was a problem processing your account');
		return;
	}

	// Create the user in the database
	const userUuid = uuidv4();
	await prisma.users.create({
		data: {
			uuid: userUuid,
			username,
			password: hash
		}
	});

	// Update the invite to mark it as used
	if (foundInvite) {
		await prisma.invites.update({
			where: {
				code: invite
			},
			data: {
				used: true,
				usedBy: userUuid,
				editedAt: utc().toDate()
			}
		});
	}

	return res.send({ message: 'The account was created successfully' });
};

export const schema = {
	description: 'Create a new user account',
	tags: ['Auth'],
	body: {
		type: 'object',
		properties: {
			username: {
				type: 'string',
				description: 'The username of the user.'
			},
			password: {
				type: 'string',
				description: 'The password of the user.'
			}
		},
		required: ['username', 'password']
	},
	headers: {
		type: 'object',
		properties: {
			invite: {
				type: 'string',
				description: 'The invite code to use.'
			}
		}
	},
	response: {
		200: {
			type: 'object',
			properties: {
				message: {
					type: 'string',
					title: 'Message',
					description: 'A message describing the result of the request.'
				}
			}
		},
		'4xx': { $ref: 'HTTP4xxError' },
		'5xx': { $ref: 'HTTP5xxError' }
	}
};
