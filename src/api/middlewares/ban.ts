import type { Request, Response, MiddlewareNext } from 'hyper-express';
import prisma from '../structures/database';
import log from 'fancy-log';

export default async (req: Request, res: Response, next: MiddlewareNext) => {
	log(`Incoming request from ip: ${req.ip}`);
	const banned = await prisma.bans.findFirst({
		where: {
			ip: req.ip
		}
	});

	if (banned) {
		return res.status(401).json({ message: 'This IP has been banned' });
	}
	next();
};
