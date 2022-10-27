import type { Response } from 'hyper-express';
import prisma from '../../structures/database';
import { constructFilePublicLink } from '../../utils/File';
import type { RequestWithUser } from '../../structures/interfaces';

export const options = {
	url: '/files',
	method: 'get',
	middlewares: ['auth']
};

export const run = async (req: RequestWithUser, res: Response) => {
	const { page = 1, limit = 100 } = req.query_parameters as { page?: number; limit?: number };

	const count = await prisma.files.count({
		where: {
			userId: req.user.id
		}
	});

	const files = await prisma.files.findMany({
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
			uuid: true
		},
		orderBy: {
			id: 'desc'
		}
	});

	const readyFiles = [];
	for (const file of files) {
		readyFiles.push(constructFilePublicLink(req, file));
	}

	return res.json({
		message: 'Successfully retrieved files',
		files: readyFiles,
		count
	});
};
