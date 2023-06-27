import type { FastifyReply } from 'fastify';
import type { RequestWithUser } from '@/structures/interfaces';
import prisma from '@/structures/database';

export const options = {
	url: '/admin/user/:uuid/demote',
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

	if (!user?.isAdmin) {
		res.badRequest('User is not an admin');
		return;
	}

	await prisma.users.update({
		where: {
			uuid
		},
		data: {
			isAdmin: false
		}
	});

	return res.send({
		message: 'Successfully demoted user'
	});
};
