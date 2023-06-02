import type { FastifyReply } from 'fastify';
import type { RequestWithUser, ExtendedFile } from '../../../structures/interfaces';
import prisma from '../../../structures/database';
import { constructFilePublicLink } from '../../../utils/File';

export const options = {
	url: '/admin/files',
	method: 'get',
	middlewares: ['auth', 'admin']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { page = 1, limit = 50 } = req.query as { page?: number; limit?: number };

	const count = await prisma.files.count();
	const files = (await prisma.files.findMany({
		take: limit,
		skip: (page - 1) * limit,
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
					username: true
				}
			}
		},
		orderBy: {
			id: 'desc'
		}
	})) as ExtendedFile[] | [];

	if (!files) return res.code(404).send({ message: 'No files exist' });

	const readyFiles = [];
	for (const file of files) {
		readyFiles.push(constructFilePublicLink(req, file));
	}

	return res.send({
		message: 'Successfully retrieved files',
		files: readyFiles,
		count
	});
};
