import type { Response } from 'hyper-express';
import prisma from '../../../structures/database';

export const url = '/admin/users';
export const method = 'GET';
export const middlewares = ['auth', 'admin'];

export const run = async (res: Response) => {
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
