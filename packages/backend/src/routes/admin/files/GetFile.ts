import type { FastifyReply } from 'fastify';
import prisma from '@/structures/database';
import { constructFilePublicLink } from '@/utils/File';
import type { User, RequestWithUser, ExtendedFile } from '@/structures/interfaces';

export const options = {
	url: '/admin/file/:uuid',
	method: 'get',
	middlewares: ['auth', 'admin']
};

interface UserWithFileCount extends User {
	fileCount?: number;
}

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid } = req.params as { uuid?: string };
	if (!uuid) {
		res.badRequest('Invalid uuid supplied');
		return;
	}

	const file = (await prisma.files.findUnique({
		where: {
			uuid
		}
	})) as ExtendedFile | null;

	if (!file) {
		res.notFound("File doesn't exist");
		return;
	}

	let user;
	if (file.userId) {
		user = await prisma.users.findUnique({
			where: {
				id: file.userId
			},
			select: {
				id: true,
				uuid: true,
				username: true,
				enabled: true,
				createdAt: true,
				editedAt: true,
				roles: {
					select: {
						name: true
					}
				}
			}
		});

		if (user) {
			(user as unknown as UserWithFileCount).fileCount = await prisma.files.count({
				where: {
					userId: user.id
				}
			});
		}
	}

	const extendedFile = {
		...file,
		...constructFilePublicLink(req, file.name)
	};

	return res.send({
		message: 'Successfully retrieved file',
		file: extendedFile,
		user
	});
};
