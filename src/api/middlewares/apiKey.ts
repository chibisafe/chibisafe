import type { Response, MiddlewareNext } from 'hyper-express';
import type { RequestWithUser } from '../structures/interfaces';
import prisma from '../structures/database';

export default async (req: RequestWithUser, res: Response, next: MiddlewareNext) => {
	// TODO: Search for canApiKey in the codebase and add this file as middleware on those, before auth
	const token = req.headers.token;
	if (!token) return next();
	const user = await prisma.users.findFirst({
		where: {
			apiKey: token
		}
	});

	if (!user) return res.status(401).json({ message: 'Invalid authorization' });
	if (!user.enabled) return res.status(401).json({ message: 'This account has been disabled' });

	req.user = user;
	next();
};
