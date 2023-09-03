import type { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '@/structures/database';
import type { User, ExtendedFile } from '@/structures/interfaces';
import { getUsedQuota } from '@/utils/User';

export const options = {
	url: '/admin/users',
	method: 'get',
	middlewares: ['auth', 'admin']
};

export const run = async (req: FastifyRequest, res: FastifyReply) => {
	const users = await prisma.users.findMany({
		select: {
			id: true,
			uuid: true,
			username: true,
			enabled: true,
			roles: {
				select: {
					name: true
				}
			},
			createdAt: true,
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
			storageQuota: await getUsedQuota(user.id)
		} as unknown as extendedUser;

		fetchedUsers.push(newObject);
	}

	return res.send({
		message: 'Successfully retrieved users',
		users: fetchedUsers
	});
};
