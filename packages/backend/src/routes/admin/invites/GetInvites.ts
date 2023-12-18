import type { FastifyReply } from 'fastify';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';

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
