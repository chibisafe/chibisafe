import type { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { responseMessageSchema } from '@/structures/schemas/ResponseMessage.js';
import { purgeUserFiles } from '@/utils/File.js';

export const schema = {
	summary: 'Purge user',
	description: 'Purge a user from the database and delete all their files and albums',
	tags: ['User Management'],
	params: z
		.object({
			uuid: z.string().describe('The uuid of the user.')
		})
		.required(),
	response: {
		200: z.object({
			message: responseMessageSchema
		}),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	url: '/admin/user/:uuid/purge',
	method: 'post',
	middlewares: ['apiKey', 'auth', 'admin']
};

export const run = async (req: FastifyRequest, res: FastifyReply) => {
	const { uuid } = req.params as { uuid?: string };
	if (!uuid) {
		void res.badRequest('Invalid uuid supplied');
		return;
	}

	const user = await prisma.users.findUnique({
		where: {
			uuid
		}
	});

	if (!user) {
		void res.badRequest('User not found');
		return;
	}

	await purgeUserFiles(user.id);

	await prisma.albums.deleteMany({
		where: {
			userId: user.id
		}
	});

	await prisma.tags.deleteMany({
		where: {
			userId: user.id
		}
	});

	await prisma.snippets.deleteMany({
		where: {
			userId: user.id
		}
	});

	return res.send({
		message: "Successfully purged user's files, albums, tags and snippets"
	});
};
