import type { FastifyReply } from 'fastify';
import prisma from '@/structures/database.js';
import type { RequestWithUser, ExtendedFile } from '@/structures/interfaces.js';
import { constructFilePublicLink } from '@/utils/File.js';

export const options = {
	url: '/files',
	method: 'get',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { page = 1, limit = 50 } = req.query as { limit?: number; page?: number };

	const count = await prisma.files.count({
		where: {
			userId: req.user.id
		}
	});

	const files = (await prisma.files.findMany({
		take: limit,
		skip: (page - 1) * limit,
		where: {
			userId: req.user.id
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
			isS3: true
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
		message: 'Successfully retrieved files',
		files: readyFiles,
		count
	});
};
