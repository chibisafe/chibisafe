import type { FastifyReply } from 'fastify';
import prisma from '@/structures/database';
import type { RequestWithUser, ExtendedFile } from '@/structures/interfaces';
import { constructFilePublicLinkNew } from '@/utils/File';

export const options = {
	url: '/files/search',
	method: 'post',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { page = 1, limit = 50 } = req.query as { page?: number; limit?: number };
	const { text } = req.body as { text?: string };

	const count = await prisma.files.count({
		where: {
			userId: req.user.id,
			OR: [
				{
					name: {
						contains: text
					}
				},
				{
					original: {
						contains: text
					}
				},
				{
					albums: {
						some: {
							name: {
								contains: text
							}
						}
					}
				}
			]
		}
	});

	const files = (await prisma.files.findMany({
		take: limit,
		skip: (page - 1) * limit,
		where: {
			userId: req.user.id,
			OR: [
				{
					name: {
						contains: text
					}
				},
				{
					original: {
						contains: text
					}
				},
				{
					albums: {
						some: {
							name: {
								contains: text
							}
						}
					}
				}
			]
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
	})) as ExtendedFile[] | [];

	const readyFiles = [];
	for (const file of files) {
		readyFiles.push({
			...file,
			...constructFilePublicLinkNew(req, file.name)
		});
	}

	return res.send({
		message: 'Successfully retrieved files',
		files: readyFiles,
		count
	});
};
