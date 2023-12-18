import type { FastifyReply } from 'fastify';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';

export const options = {
	url: '/admin/user/:uuid/quota',
	method: 'post',
	middlewares: ['apiKey', 'auth', 'admin']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid } = req.params as { uuid: string };
	const { space }: { space: number } = req.body as { space: number };

	await prisma.users.update({
		where: {
			uuid
		},
		data: {
			storageQuota: String(space)
		}
	});

	return res.send({
		message: "Successfully changed user's storage quota"
	});
};
