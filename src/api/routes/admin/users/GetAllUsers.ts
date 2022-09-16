import type { Request, Response } from 'hyper-express';
import prisma from '../../../structures/database';

export const options = {
	url: '/admin/users',
	method: 'get',
	middlewares: ['auth', 'admin']
};

export const run = async (req: Request, res: Response) => {
	const users = await prisma.users.findMany({
		select: {
			id: true,
			uuid: true,
			username: true,
			enabled: true,
			isAdmin: true,
			createdAt: true
		}
	});

	return res.json({
		message: 'Successfully retrieved users',
		users
	});
};
