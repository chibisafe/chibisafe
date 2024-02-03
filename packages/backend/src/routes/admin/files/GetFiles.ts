import type { Prisma } from '@prisma/client';
import type { FastifyReply } from 'fastify';
import prisma from '@/structures/database.js';
import type { RequestWithUser, ExtendedFile } from '@/structures/interfaces.js';
import { constructFilePublicLink } from '@/utils/File.js';

export const options = {
	url: '/admin/files',
	method: 'get',
	middlewares: ['apiKey', 'auth', 'admin']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const {
		publicOnly = false,
		page = 1,
		limit = 50,
		quarantine = false
	} = req.query as { limit?: number; page?: number; publicOnly: boolean; quarantine?: boolean };

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
			},
			isS3: true
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
		void res.notFound('No files exist');
		return;
	}

	const readyFiles = [];
	for (const file of files) {
		readyFiles.push({
			...file,
			...constructFilePublicLink({
				req,
				fileName: quarantine ? file.quarantineFile.name : file.name,
				quarantine,
				isS3: file.isS3
			})
		});
	}

	return res.send({
		message: 'Successfully retrieved files',
		files: readyFiles,
		count
	});
};
