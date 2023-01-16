import type { Response } from 'hyper-express';
import type { RequestWithUser } from '../structures/interfaces';
import prisma from '../structures/database';

export default async (req: RequestWithUser, res: Response) => {
	const apiKey = req.headers['x-api-key'];
	if (!apiKey) return;
	const user = await prisma.users.findFirst({
		where: {
			apiKey
		}
	});

	if (!user) return res.status(401).json({ message: 'Invalid authorization' });
	if (!user.enabled) return res.status(401).json({ message: 'This account has been disabled' });

	// eslint-disable-next-line require-atomic-updates
	req.user = user;
};
