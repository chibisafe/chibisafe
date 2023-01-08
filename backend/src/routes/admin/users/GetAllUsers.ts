import type { Request, Response } from 'hyper-express';
import prisma from '../../../structures/database';
import type { User } from '../../../structures/interfaces';

export const options = {
	url: '/admin/users',
	method: 'get',
	middlewares: ['auth', 'admin']
};

export const run = async (req: Request, res: Response) => {
	const users = await prisma.users.findMany({
		select: {
			uuid: true,
			username: true,
			enabled: true,
			isAdmin: true,
			createdAt: true,
			files: {
				select: {
					size: true
				}
			},
			_count: {
				select: {
					files: true
				}
			}
		}
	});

	interface extendedUser extends User {
		files?: [];
		size: number;
	}

	const fetchedUsers = [];
	for (const user of users) {
		const newObject = {
			...user,
			size: 0
		} as unknown as extendedUser;

		for (const file of user.files) newObject.size += file.size;

		delete newObject.files;

		fetchedUsers.push(newObject);
	}

	return res.json({
		message: 'Successfully retrieved users',
		users: fetchedUsers
	});
};
