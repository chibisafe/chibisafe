import type { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import type { User } from '@/structures/interfaces.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { responseMessageSchema } from '@/structures/schemas/ResponseMessage.js';
import { storageQuotaSchema } from '@/structures/schemas/StorageQuota.js';
import { userAsAdminSchema } from '@/structures/schemas/UserAsAdmin.js';
import { getUsedQuota } from '@/utils/User.js';

export const schema = {
	summary: 'Get users',
	description: 'Get all users',
	tags: ['User Management'],
	response: {
		200: z.object({
			message: responseMessageSchema,
			users: z
				.array(
					userAsAdminSchema.extend({
						storageQuota: storageQuotaSchema,
						_count: z
							.object({
								files: z.number().describe('The number of files the user has uploaded.')
							})
							.describe('The count object.')
					})
				)
				.describe('The users array.')
		}),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	url: '/admin/users',
	method: 'get',
	middlewares: ['apiKey', 'auth', 'admin']
};

export const run = async (_: FastifyRequest, res: FastifyReply) => {
	const users = await prisma.users.findMany({
		select: {
			id: true,
			uuid: true,
			username: true,
			enabled: true,
			roles: {
				select: {
					name: true
				}
			},
			createdAt: true,
			_count: {
				select: {
					files: true
				}
			}
		}
	});

	interface extendedUser extends User {
		files?: [];
		size: number;
	}

	const fetchedUsers = [];
	for (const user of users) {
		const newObject = {
			...user,
			storageQuota: await getUsedQuota(user.id)
		} as unknown as extendedUser;

		fetchedUsers.push(newObject);
	}

	return res.send({
		message: 'Successfully retrieved users',
		users: fetchedUsers
	});
};
