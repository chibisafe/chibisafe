import type { FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import type { RequestWithUser, ExtendedFile } from '@/structures/interfaces.js';
import { fileAsUserSchema } from '@/structures/schemas/FileAsUser.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { queryLimitSchema } from '@/structures/schemas/QueryLimit.js';
import { queryPageSchema } from '@/structures/schemas/QueryPage.js';
import { responseMessageSchema } from '@/structures/schemas/ResponseMessage.js';
import { constructFilePublicLink } from '@/utils/File.js';

export const schema = {
	summary: 'Search',
	description: 'Search all the files',
	tags: ['Files'],
	query: z.object({
		page: queryPageSchema,
		limit: queryLimitSchema
	}),
	body: z
		.object({
			text: z.string().describe('The text you want to search within your files.')
		})
		.required(),
	response: {
		200: z.object({
			message: responseMessageSchema,
			files: z.array(fileAsUserSchema),
			count: z.number().describe('The amount of files that exist.')
		}),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	url: '/files/search',
	method: 'post',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { page = 1, limit = 50 } = req.query as { limit?: number; page?: number };
	const { text } = req.body as { text: string };

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
			uuid: true,
			isS3: true,
			isWatched: true
		},
		orderBy: {
			id: 'desc'
		}
	})) as ExtendedFile[] | [];

	const readyFiles = [];
	for (const file of files) {
		readyFiles.push({
			...file,
			...constructFilePublicLink({ req, fileName: file.name, isS3: file.isS3, isWatched: file.isWatched })
		});
	}

	return res.send({
		message: 'Successfully retrieved files',
		files: readyFiles,
		count
	});
};
