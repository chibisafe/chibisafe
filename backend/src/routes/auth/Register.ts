import type { Request, Response } from 'hyper-express';
import prisma from '../../structures/database';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import log from '../../utils/Log';
import { getEnvironmentDefaults } from '../../utils/Util';
import { utc } from 'moment';

export const options = {
	url: '/auth/register',
	method: 'post'
};

export const run = async (req: Request, res: Response) => {
	let foundInvite = null;

	// If new account creation is deactivated then check for an invite
	if (!getEnvironmentDefaults().userAccounts) {
		if (!req.headers.invite) {
			return res.status(401).json({
				message: 'Creation of new accounts is currently disabled'
			});
		}

		// Check if the invite is valid has not been used yet
		foundInvite = await prisma.invites.findFirst({
			where: {
				code: req.headers.invite,
				used: false
			}
		});

		// If no invite was found then reject the call
		if (!foundInvite) {
			return res.status(401).json({
				message: 'Invalid invite code'
			});
		}
	}

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
	} catch (error) {
		log.error(error);
		return res.status(401).json({ message: 'There was a problem processing your account' });
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
				code: req.headers.invite
			},
			data: {
				used: true,
				usedBy: userUuid,
				editedAt: utc().toDate()
			}
		});
	}

	return res.json({ message: 'The account was created successfully' });
};
