import type { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '../../../structures/database';
import type { User, ExtendedFile } from '../../../structures/interfaces';

export const options = {
	url: '/admin/users',
	method: 'get',
	middlewares: ['auth', 'admin']
};

export const run = async (req: FastifyRequest, res: FastifyReply) => {
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

		const files = [...user.files] as ExtendedFile[] | [];
		for (const file of files) newObject.size += Number(file.size);

		delete newObject.files;

		fetchedUsers.push(newObject);
	}

	return res.send({
		message: 'Successfully retrieved users',
		users: fetchedUsers
	});
};
