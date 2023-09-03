import type { FastifyReply } from 'fastify';
import type { RequestWithUser, ExtendedFile } from '@/structures/interfaces';
import prisma from '@/structures/database';
import { constructFilePublicLink } from '@/utils/File';

export const options = {
	url: '/admin/files',
	method: 'get',
	middlewares: ['auth', 'admin']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const {
		publicOnly = false,
		page = 1,
		limit = 50
	} = req.query as { publicOnly: boolean; page?: number; limit?: number };

	const dbSearchObject = {} as any;
	const dbObject = {
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
			uuid: true
		},
		orderBy: {
			id: 'desc'
		}
	} as any;

	if (publicOnly) {
		dbSearchObject.where = {
			userId: null
		};

		dbObject.where = {
			userId: null
		};
	} else {
		dbObject.select.user = {
			select: {
				uuid: true,
				username: true,
				enabled: true,
				createdAt: true,
				roles: {
					select: {
						name: true
					}
				}
			}
		};
	}

	const count = await prisma.files.count(dbSearchObject);
	const files = (await prisma.files.findMany(dbObject)) as ExtendedFile[] | [];

	if (!files) {
		res.notFound('No files exist');
		return;
	}

	const readyFiles = [];
	for (const file of files) {
		readyFiles.push({
			...file,
			...constructFilePublicLink(req, file.name)
		});
	}

	return res.send({
		message: 'Successfully retrieved files',
		files: readyFiles,
		count
	});
};
