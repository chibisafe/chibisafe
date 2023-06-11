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
	if (!uuid) return res.code(400).send({ message: 'Invalid uuid supplied' });

	if (uuid === req.user.uuid) return res.code(400).send({ message: "You can't apply this action to yourself" });

	const user = await prisma.users.findUnique({
		where: {
			uuid
		}
	});

	if (user?.isAdmin) return res.code(400).send({ message: 'User is already an admin' });

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
