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
	if (!uuid) return res.code(400).send({ message: 'Invalid uuid supplied' });

	const file = (await prisma.files.findUnique({
		where: {
			uuid
		}
	})) as ExtendedFile | null;

	if (!file) return res.code(404).send({ message: "File doesn't exist" });

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
				isAdmin: true
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

	const extendedFile = constructFilePublicLink(req, file);

	return res.send({
		message: 'Successfully retrieved file',
		file: extendedFile,
		user
	});
};
