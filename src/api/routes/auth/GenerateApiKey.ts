import type { Response } from 'hyper-express';
import type { RequestWithUser } from '../../structures/interfaces';
import prisma from '../../structures/database';
import { utc } from 'moment';
import randomstring from 'randomstring';

export const url = '/auth/apikey/change';
export const method = 'POST';
export const middlewares = ['auth'];

export const run = async (req: RequestWithUser, res: Response) => {
	const now = utc().toDate();
	const apiKey = randomstring.generate(64);

	await prisma.users.update({
		where: {
			id: req.user.id
		},
		data: {
			apiKey,
			apiKeyEditedAt: now
		}
	});

	return res.json({
		message: 'Successfully created new api key',
		apiKey
	});
};
