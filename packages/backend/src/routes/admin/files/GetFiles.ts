import type { Prisma } from '@prisma/client';
import type { FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import type { RequestWithUser, ExtendedFile } from '@/structures/interfaces.js';
import { booleanSchema } from '@/structures/schemas/Boolean.js';
import { fileAsAdminSchema } from '@/structures/schemas/FileAsAdmin.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { queryLimitSchema } from '@/structures/schemas/QueryLimit.js';
import { queryPageSchema } from '@/structures/schemas/QueryPage.js';
import { constructFilePublicLink } from '@/utils/File.js';

export const schema = {
	summary: 'Get all files',
	description: 'Gets all files as admin',
	tags: ['Files'],
	query: z.object({
		publicOnly: booleanSchema.describe('Whether to only get public files.'),
		page: queryPageSchema,
		limit: queryLimitSchema,
		quarantine: booleanSchema.describe('Whether to only get quarantined files.')
	}),
	response: {
		200: z.object({
			message: z.string().describe('The response message.'),
			files: z.array(fileAsAdminSchema),
			count: z.number().describe('The total count of files.')
		}),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

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
			isS3: true,
			isWatched: true
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

	const readyFiles = [];
	for (const file of files) {
		readyFiles.push({
			...file,
			...constructFilePublicLink({
				req,
				fileName: quarantine ? file.quarantineFile.name : file.name,
				quarantine,
				isS3: file.isS3,
				isWatched: file.isWatched
			})
		});
	}

	return res.send({
		message: 'Successfully retrieved files',
		files: readyFiles,
		count
	});
};
