import type { FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import type { RequestWithUser, ExtendedFile } from '@/structures/interfaces.js';
import { fileAsAdminSchema } from '@/structures/schemas/FileAsAdmin.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { queryLimitSchema } from '@/structures/schemas/QueryLimit.js';
import { queryPageSchema } from '@/structures/schemas/QueryPage.js';
import { constructFilePublicLink } from '@/utils/File.js';

export const schema = {
	summary: 'Get files',
	description: 'Gets all files from a specific IP',
	tags: ['Files', 'IP Management'],
	query: z.object({
		page: queryPageSchema,
		limit: queryLimitSchema
	}),
	body: z
		.object({
			ip: z.string().describe('The IP address.')
		})
		.required(),
	response: {
		200: z.object({
			message: z.string().describe('The response message.'),
			files: z.array(fileAsAdminSchema),
			count: z.number().describe('The amount of files that exist.'),
			banned: z.boolean().describe('Whether or not the IP is banned.')
		}),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

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
			...constructFilePublicLink({ req, fileName: file.name, isS3: file.isS3, isWatched: file.isWatched })
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
