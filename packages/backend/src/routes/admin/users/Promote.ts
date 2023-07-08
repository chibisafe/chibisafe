import type { FastifyReply } from 'fastify';
import type { RequestWithUser } from '@/structures/interfaces';
import prisma from '@/structures/database';

export const options = {
	url: '/admin/user/:uuid/promote',
	method: 'post',
	middlewares: ['auth', 'owner']
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
		},
		include: {
			roles: {
				select: {
					name: true
				}
			}
		}
	});

	if (user?.roles.some(role => role.name === 'admin')) {
		res.badRequest('User is already an admin');
		return;
	}

	await prisma.users.update({
		where: {
			uuid
		},
		data: {
			roles: {
				connect: {
					name: 'admin'
				}
			}
		}
	});

	return res.send({
		message: 'Successfully promoted user'
	});
};
