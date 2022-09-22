// TODO: Merge with auth middleware,
// but have it be possible to actually make auth optional (?)

import type { Response, MiddlewareNext } from 'hyper-express';
import type { RequestWithOptionalUser } from '../structures/interfaces';
import JWT from 'jsonwebtoken';
import prisma from '../structures/database';

interface Decoded {
	sub: number;
}

export default (req: RequestWithOptionalUser, res: Response, next: MiddlewareNext) => {
	if (!req.headers.authorization) return next();

	const token = req.headers.authorization.split(' ')[1];
	if (!token) return next();

	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	JWT.verify(token, process.env.JWT_SECRET ?? '', async (error, decoded) => {
		if (error) return res.status(401).json({ message: 'Invalid token' });
		const id = (decoded as Decoded | undefined)?.sub ?? null;
		if (!id) return res.status(401).json({ message: 'Invalid authorization' });

		const user = await prisma.users.findFirst({
			where: {
				id
			},
			select: {
				id: true,
				uuid: true,
				username: true,
				isAdmin: true
			}
		});

		if (!user) return res.status(401).json({ message: "User doesn't exist" });
		req.user = user;
		next();
	});
};
