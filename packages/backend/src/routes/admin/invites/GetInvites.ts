import type { FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';

export const schema = {
	summary: 'Get invites',
	description: 'Get all created invites',
	tags: ['Invites'],
	response: {
		200: z.object({
			message: z.string().describe('The response message.'),
			invites: z
				.array(
					z.object({
						code: z.string().describe('The invite code.'),
						createdBy: z
							.object({
								uuid: z.string().describe('The uuid of the user who created the invite'),
								username: z.string().describe('The username of the user who created the invite')
							})
							.describe('The user who created the invite.'),
						used: z.boolean().describe('Whether the invite has been used.'),
						usedBy: z
							.object({
								uuid: z.string().optional().describe('The uuid of the user who used the invite'),
								username: z.string().optional().describe('The username of the user who used the invite')
							})
							.optional()
							.describe('The user who used the invite.'),
						createdAt: z.date().describe('The date the invite was created.'),
						editedAt: z.date().nullable().describe('The date the invite was edited.')
					})
				)
				.describe('The list of invites.')
		}),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	url: '/admin/invites',
	method: 'get',
	middlewares: ['apiKey', 'auth', 'admin']
};

export const run = async (_: RequestWithUser, res: FastifyReply) => {
	const invites = await prisma.invites.findMany();

	const response = [];
	for (const invite of invites) {
		const temp = {
			code: invite.code,
			createdBy: {} as any,
			used: invite.used,
			usedBy: {} as any,
			createdAt: invite.createdAt,
			editedAt: invite.editedAt
		};

		const createdBy = await prisma.users.findUnique({
			where: {
				uuid: invite.createdBy
			},
			select: {
				username: true,
				uuid: true
			}
		});

		temp.createdBy = createdBy;

		if (invite.used && invite.usedBy) {
			const usedBy = await prisma.users.findUnique({
				where: {
					uuid: invite.usedBy
				},
				select: {
					username: true,
					uuid: true
				}
			});

			temp.usedBy = usedBy;
		}

		response.push(temp);
	}

	return res.send({
		message: 'Successfully retrieved invites',
		invites: response
	});
};
