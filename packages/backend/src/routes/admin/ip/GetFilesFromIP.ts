import type { FastifyReply } from 'fastify';
import prisma from '@/structures/database';
import { constructFilePublicLink } from '@/utils/File';
import type { RequestWithUser, ExtendedFile } from '@/structures/interfaces';

export const options = {
	url: '/admin/ip/files',
	method: 'post',
	middlewares: ['auth', 'admin']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { page = 1, limit = 50 } = req.query as { page?: number; limit?: number };
	const { ip }: { ip: string } = req.body as { ip: string };

	if (!ip) return res.code(400).send({ message: 'No ip provided' });

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
		readyFiles.push(constructFilePublicLink(req, file));
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
