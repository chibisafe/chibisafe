import type { FastifyReply } from 'fastify';
import prisma from '@/structures/database.js';
import type { RequestWithUser, ExtendedFile } from '@/structures/interfaces.js';
import { constructFilePublicLink } from '@/utils/File.js';

export const options = {
	url: '/admin/ip/files',
	method: 'post',
	middlewares: ['apiKey', 'auth', 'admin']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { page = 1, limit = 50 } = req.query as { limit?: number; page?: number };
	const { ip }: { ip: string } = req.body as { ip: string };

	const count = await prisma.files.count({
		where: {
			ip
		}
	});

	const files = (await prisma.files.findMany({
		take: limit,
		skip: (page - 1) * limit,
		where: {
			ip
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

	const checkForBan = await prisma.bans.findFirst({
		where: {
			ip
		}
	});

	return res.send({
		message: "Successfully retrieved IP's files",
		files: readyFiles,
		count,
		banned: Boolean(checkForBan)
	});
};
