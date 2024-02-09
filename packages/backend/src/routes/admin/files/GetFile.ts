import type { FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import type { User, RequestWithUser, ExtendedFile } from '@/structures/interfaces.js';
import { fileAsUserSchema } from '@/structures/schemas/FileAsUser.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { userAsAdminSchema } from '@/structures/schemas/UserAsAdmin.js';
import { constructFilePublicLink } from '@/utils/File.js';

export const schema = {
	summary: 'Get file',
	description: 'Gets a file as admin',
	tags: ['Files'],
	params: z
		.object({
			uuid: z.string().describe('The uuid of the file.')
		})
		.required(),
	response: {
		200: z.object({
			message: z.string().describe('The response message.'),
			file: fileAsUserSchema,
			user: userAsAdminSchema
		}),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	url: '/admin/file/:uuid',
	method: 'get',
	middlewares: ['apiKey', 'auth', 'admin']
};

interface UserWithFileCount extends User {
	fileCount?: number;
}

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid } = req.params as { uuid?: string };
	if (!uuid) {
		void res.badRequest('Invalid uuid supplied');
		return;
	}

	const file = (await prisma.files.findUnique({
		where: {
			uuid
		}
	})) as ExtendedFile | null;

	if (!file) {
		void res.notFound("File doesn't exist");
		return;
	}

	let user;
	if (file.userId) {
		user = await prisma.users.findUnique({
			where: {
				id: file.userId
			},
			select: {
				id: true,
				uuid: true,
				username: true,
				enabled: true,
				createdAt: true,
				editedAt: true,
				roles: {
					select: {
						name: true
					}
				}
			}
		});

		if (user) {
			(user as unknown as UserWithFileCount).fileCount = await prisma.files.count({
				where: {
					userId: user.id
				}
			});
		}
	}

	const extendedFile = {
		...file,
		...constructFilePublicLink({ req, fileName: file.name, isS3: file.isS3, isWatched: file.isWatched })
	};

	return res.send({
		message: 'Successfully retrieved file',
		file: extendedFile,
		user
	});
};
