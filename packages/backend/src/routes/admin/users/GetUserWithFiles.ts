import type { FastifyRequest, FastifyReply } from 'fastify';
import type { ExtendedFile } from '@/structures/interfaces';
import prisma from '@/structures/database';
import { constructFilePublicLink } from '@/utils/File';

export const options = {
	url: '/admin/user/:uuid/files',
	method: 'get',
	middlewares: ['auth', 'admin']
};

export const run = async (req: FastifyRequest, res: FastifyReply) => {
	const { uuid } = req.params as { uuid?: string };
	if (!uuid) return res.code(400).send({ message: 'Invalid uuid supplied' });

	const { page = 1, limit = 50 } = req.query as { page?: number; limit?: number };

	const user = await prisma.users.findUnique({
		where: {
			uuid
		},
		select: {
			id: true
		}
	});

	if (!user) return res.code(404).send({ message: 'User not found' });

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
			user: {
				select: {
					uuid: true,
					username: true,
					enabled: true,
					isAdmin: true,
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
		readyFiles.push(constructFilePublicLink(req, file));
	}

	return res.send({
		message: "Successfully retrieved user's files",
		files: readyFiles,
		count
	});
};
