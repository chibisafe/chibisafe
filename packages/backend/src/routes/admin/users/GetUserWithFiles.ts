import type { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '@/structures/database.js';
import type { ExtendedFile } from '@/structures/interfaces.js';
import { constructFilePublicLink } from '@/utils/File.js';

export const options = {
	url: '/admin/user/:uuid/files',
	method: 'get',
	middlewares: ['apiKey', 'auth', 'admin']
};

export const run = async (req: FastifyRequest, res: FastifyReply) => {
	const { uuid } = req.params as { uuid?: string };
	if (!uuid) {
		void res.badRequest('Invalid uuid supplied');
		return;
	}

	const { page = 1, limit = 50 } = req.query as { limit?: number; page?: number };

	const user = await prisma.users.findUnique({
		where: {
			uuid
		},
		select: {
			id: true
		}
	});

	if (!user) {
		void res.notFound('User not found');
		return;
	}

	const count = await prisma.files.count({
		where: {
			userId: user.id
		}
	});

	const files = (await prisma.files.findMany({
		take: limit,
		skip: (page - 1) * limit,
		where: {
			userId: user.id
		},
		select: {
			createdAt: true,
			editedAt: true,
			hash: true,
			ip: true,
			name: true,
			original: true,
			size: true,
			type: true,
			uuid: true,
			quarantine: true,
			quarantineFile: {
				select: {
					name: true
				}
			},
			isS3: true,
			user: {
				select: {
					uuid: true,
					username: true,
					enabled: true,
					roles: {
						select: {
							name: true
						}
					},
					createdAt: true
				}
			}
		},
		orderBy: {
			id: 'desc'
		}
	})) as ExtendedFile[] | [];

	const readyFiles = [];
	for (const file of files) {
		readyFiles.push({
			...file,
			...constructFilePublicLink({ req, fileName: file.name, isS3: file.isS3 })
		});
	}

	return res.send({
		message: "Successfully retrieved user's files",
		files: readyFiles,
		count
	});
};
