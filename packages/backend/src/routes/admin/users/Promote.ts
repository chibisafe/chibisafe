import type { FastifyReply } from 'fastify';
import type { RequestWithUser } from '@/structures/interfaces';
import prisma from '@/structures/database';

export const options = {
	url: '/admin/user/:uuid/promote',
	method: 'post',
	middlewares: ['auth', 'admin']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid } = req.params as { uuid?: string };
	if (!uuid) {
		res.badRequest('Invalid uuid supplied');
		return;
	}

	if (uuid === req.user.uuid) {
		res.badRequest("You can't apply this action to yourself");
		return;
	}

	const user = await prisma.users.findUnique({
		where: {
			uuid
		}
	});

	if (user?.isAdmin) {
		res.badRequest('User is already an admin');
		return;
	}

	await prisma.users.update({
		where: {
			uuid
		},
		data: {
			isAdmin: true
		}
	});

	return res.send({
		message: 'Successfully promoted user'
	});
};
