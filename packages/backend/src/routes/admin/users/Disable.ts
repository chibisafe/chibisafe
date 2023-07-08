import type { FastifyReply } from 'fastify';
import type { RequestWithUser } from '@/structures/interfaces';
import prisma from '@/structures/database';

export const options = {
	url: '/admin/user/:uuid/disable',
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
		},
		include: {
			roles: {
				select: {
					name: true
				}
			}
		}
	});

	if (
		user?.roles.some(role => role.name === 'admin' || role.name === 'owner') &&
		!req.user.roles.some(role => role.name === 'owner')
	) {
		res.badRequest('You cannot disable another admin or owner');
		return;
	}

	if (!user?.enabled) {
		res.badRequest('User is already disabled');
		return;
	}

	await prisma.users.update({
		where: {
			uuid
		},
		data: {
			enabled: false
		}
	});

	return res.send({
		message: 'Successfully disabled user'
	});
};
