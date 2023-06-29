import type { FastifyReply } from 'fastify';
import type { RequestWithUser } from '@/structures/interfaces';
import prisma from '@/structures/database';

export const options = {
	url: '/admin/user/:uuid/quota',
	method: 'post',
	middlewares: ['auth', 'admin']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid } = req.params as { uuid?: string };
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
		message: "Successfully change user's storage quota"
	});
};
