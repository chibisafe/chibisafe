import type { Request, Response } from 'hyper-express';
import prisma from '../structures/database';

export default async (req: Request, res: Response) => {
	const banned = await prisma.bans.findFirst({
		where: {
			ip: req.ip
		}
	});

	if (banned) {
		return res.status(401).json({ message: 'This IP has been banned' });
	}
};
