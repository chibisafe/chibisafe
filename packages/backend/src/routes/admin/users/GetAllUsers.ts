import type { Prisma } from '@prisma/client';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import type { User } from '@/structures/interfaces.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { queryLimitSchema } from '@/structures/schemas/QueryLimit.js';
import { queryPageSchema } from '@/structures/schemas/QueryPage.js';
import { responseMessageSchema } from '@/structures/schemas/ResponseMessage.js';
import { storageQuotaSchema } from '@/structures/schemas/StorageQuota.js';
import { userAsAdminSchema } from '@/structures/schemas/UserAsAdmin.js';
import { getUsedQuota } from '@/utils/User.js';

export const schema = {
	summary: 'Get users',
	description: 'Get all users',
	tags: ['User Management'],
	query: z.object({
		page: queryPageSchema,
		limit: queryLimitSchema,
		search: z.string().optional().describe('The text you want to search within all users.')
	}),
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
				.describe('The users array.'),
			count: z.number().describe('The amount of users that exist.')
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

export const run = async (req: FastifyRequest, res: FastifyReply) => {
	const { page = 1, limit = 50, search = '' } = req.query as { limit?: number; page?: number; search?: string };

	let dbSearchObject: Prisma.usersCountArgs['where'] = {};

	if (search) {
		dbSearchObject = {
			...dbSearchObject,
			username: {
				contains: search
			}
		};
	}

	const count = await prisma.users.count({
		where: dbSearchObject
	});

	const users = await prisma.users.findMany({
		take: limit,
		skip: (page - 1) * limit,
		where: dbSearchObject,
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
		users: fetchedUsers,
		count
	});
};
