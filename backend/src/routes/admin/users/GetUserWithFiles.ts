import type { Request, Response } from 'hyper-express';
import prisma from '../../../structures/database';
import { constructFilePublicLink } from '../../../utils/File';

export const options = {
	url: '/admin/user/:uuid/files',
	method: 'get',
	middlewares: ['auth', 'admin']
};

export const run = async (req: Request, res: Response) => {
	const { uuid } = req.path_parameters;
	if (!uuid) return res.status(400).json({ message: 'Invalid uuid supplied' });

	const { page = 1, limit = 50 } = req.query_parameters as { page?: number; limit?: number };

	const user = await prisma.users.findUnique({
		where: {
			uuid
		},
		select: {
			id: true,
			username: true,
			enabled: true,
			isAdmin: true,
			createdAt: true,
			editedAt: true,
			apiKeyEditedAt: true
		}
	});

	if (!user) return res.status(404).json({ message: 'User not found' });

	const count = await prisma.files.count({
		where: {
			userId: user.id
		}
	});

	const files = await prisma.files.findMany({
		take: limit,
		skip: (page - 1) * limit,
		where: {
			userId: user.id
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
		message: 'Successfully retrieved user',
		user,
		files: readyFiles,
		count
	});
};
