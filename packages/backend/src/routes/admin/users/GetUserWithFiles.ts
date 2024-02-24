import type { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import type { ExtendedFile } from '@/structures/interfaces.js';
import { fileAsAdminSchema } from '@/structures/schemas/FileAsAdmin.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { queryPageSchema } from '@/structures/schemas/QueryPage.js';
import { responseMessageSchema } from '@/structures/schemas/ResponseMessage.js';
import { constructFilePublicLink } from '@/utils/File.js';

export const schema = {
	summary: 'Get user with files',
	description: 'Get a user and their files',
	tags: ['User Management'],
	params: z
		.object({
			uuid: z.string().describe('The uuid of the user.')
		})
		.required(),
	query: z.object({
		page: queryPageSchema,
		limit: queryPageSchema
	}),
	response: {
		200: z.object({
			message: responseMessageSchema,
			files: z.array(fileAsAdminSchema),
			count: z.number().describe('The amount of files that exist.')
		}),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	url: '/admin/user/:uuid/files',
	method: 'get',
	middlewares: ['apiKey', 'auth', 'admin']
};

export const run = async (req: FastifyRequest, res: FastifyReply) => {
	const { uuid } = req.params as { uuid?: string };
	if (!uuid) {
		void res.badRequest('Invalid uuid supplied');
		return;
	}

	const { page = 1, limit = 50 } = req.query as { limit?: number; page?: number };

	const user = await prisma.users.findUnique({
		where: {
			uuid
		},
		select: {
			id: true
		}
	});

	if (!user) {
		void res.notFound('User not found');
		return;
	}

	const count = await prisma.files.count({
		where: {
			userId: user.id
		}
	});

	const files = (await prisma.files.findMany({
		take: limit,
		skip: (page - 1) * limit,
		where: {
			userId: user.id
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
			quarantine: true,
			quarantineFile: {
				select: {
					name: true
				}
			},
			isS3: true,
			isWatched: true,
			user: {
				select: {
					uuid: true,
					username: true,
					enabled: true,
					roles: {
						select: {
							name: true
						}
					},
					createdAt: true
				}
			}
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
		message: "Successfully retrieved user's files",
		files: readyFiles,
		count
	});
};
