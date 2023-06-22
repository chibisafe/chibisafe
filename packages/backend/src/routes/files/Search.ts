import type { FastifyReply } from 'fastify';
import prisma from '@/structures/database';
import type { RequestWithUser, ExtendedFile } from '@/structures/interfaces';
import { constructFilePublicLink } from '@/utils/File';

export const options = {
	url: '/files/search',
	method: 'post',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { page = 1, limit = 50 } = req.query as { page?: number; limit?: number };
	const { text } = req.body as { text?: string };
	if (!text) return res.code(400).send({ message: 'No text provided' });

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
		readyFiles.push(constructFilePublicLink(req, file));
	}

	return res.send({
		message: 'Successfully retrieved files',
		files: readyFiles,
		count
	});
};
