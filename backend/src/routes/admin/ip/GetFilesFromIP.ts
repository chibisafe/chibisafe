import type { Response } from 'hyper-express';
import prisma from '../../../structures/database';
import { constructFilePublicLink } from '../../../utils/File';
import type { RequestWithUser } from '../../../structures/interfaces';

export const options = {
	url: '/admin/ip/files',
	method: 'post',
	middlewares: ['auth', 'admin']
};

export const run = async (req: RequestWithUser, res: Response) => {
	const { page = 1, limit = 100 } = req.query_parameters as { page?: number; limit?: number };
	const { ip }: { ip: string } = await req.json();

	if (!ip) return res.status(400).json({ message: 'No ip provided' });

	const count = await prisma.files.count({
		where: {
			ip
		}
	});

	const files = await prisma.files.findMany({
		take: limit,
		skip: (page - 1) * limit,
		where: {
			ip
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
		message: "Successfully retrieved IP's files",
		files: readyFiles,
		count
	});
};
