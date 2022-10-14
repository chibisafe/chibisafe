import type { Response } from 'hyper-express';
import type { RequestWithUser } from '../structures/interfaces';
import prisma from '../structures/database';

export default async (req: RequestWithUser, res: Response) => {
	const token = req.headers.token;
	if (!token) return;
	const user = await prisma.users.findFirst({
		where: {
			apiKey: token
		}
	});

	if (!user) return res.status(401).json({ message: 'Invalid authorization' });
	if (!user.enabled) return res.status(401).json({ message: 'This account has been disabled' });

	// eslint-disable-next-line require-atomic-updates
	req.user = user;
};
