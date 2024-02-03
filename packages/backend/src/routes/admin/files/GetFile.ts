import type { FastifyReply } from 'fastify';
import prisma from '@/structures/database.js';
import type { User, RequestWithUser, ExtendedFile } from '@/structures/interfaces.js';
import { constructFilePublicLink } from '@/utils/File.js';

export const options = {
	url: '/admin/file/:uuid',
	method: 'get',
	middlewares: ['apiKey', 'auth', 'admin']
};

interface UserWithFileCount extends User {
	fileCount?: number;
}

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid } = req.params as { uuid?: string };
	if (!uuid) {
		void res.badRequest('Invalid uuid supplied');
		return;
	}

	const file = (await prisma.files.findUnique({
		where: {
			uuid
		}
	})) as ExtendedFile | null;

	if (!file) {
		void res.notFound("File doesn't exist");
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
		...constructFilePublicLink({ req, fileName: file.name, isS3: file.isS3 })
	};

	return res.send({
		message: 'Successfully retrieved file',
		file: extendedFile,
		user
	});
};
