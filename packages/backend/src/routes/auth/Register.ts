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
		return res.code(401).send({
			message: 'Creation of new accounts is currently disabled without an invite'
		});
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
			return res.code(401).send({
				message: 'Invalid invite code'
			});
		}
	}

	const { username, password } = req.body as { username?: string; password?: string };
	if (!username || !password)
		return res.code(400).send({
			message: 'No username or password provided'
		});

	if (username.length < 4 || username.length > 32) {
		return res.code(400).send({ message: 'Username must have 4-32 characters' });
	}

	if (password.length < 6 || password.length > 64) {
		return res.code(400).send({ message: 'Password must have 6-64 characters' });
	}

	const exists = await prisma.users.findFirst({
		where: {
			username
		}
	});

	if (exists) return res.code(400).send({ message: 'Username already exists' });

	let hash;
	try {
		hash = await bcrypt.hash(password, 10);
	} catch (error) {
		res.log.error(error);
		return res.code(401).send({ message: 'There was a problem processing your account' });
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
