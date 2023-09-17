import type { FastifyReply } from 'fastify';
import type { RequestWithUser, ExtendedFile } from '@/structures/interfaces';
import prisma from '@/structures/database';
import { constructFilePublicLink } from '@/utils/File';
import type { Prisma } from '@prisma/client';

export const options = {
	url: '/admin/files',
	method: 'get',
	middlewares: ['auth', 'admin']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const {
		publicOnly = false,
		page = 1,
		limit = 50,
		quarantine = false
	} = req.query as { publicOnly: boolean; page?: number; limit?: number; quarantine?: boolean };

	const dbSearchObject: Prisma.filesCountArgs = {
		where: {
			quarantine
		}
	};
	const dbObject: Prisma.filesFindManyArgs = {
		where: {
			quarantine
		},
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
			quarantine: true,
			quarantineFile: {
				select: {
					name: true
				}
			}
		},
		orderBy: {
			id: 'desc'
		}
	};

	if (publicOnly) {
		dbSearchObject.where = {
			...dbSearchObject.where,
			userId: null
		};

		dbObject.where = {
			...dbObject.where,
			userId: null
		};
	} else {
		dbObject.select!.user = {
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
			...constructFilePublicLink(req, quarantine ? file.quarantineFile.name : file.name, quarantine)
		});
	}

	return res.send({
		message: 'Successfully retrieved files',
		files: readyFiles,
		count
	});
};
