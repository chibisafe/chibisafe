import type { FastifyReply } from 'fastify';
import type { RequestWithUser } from '../../../../structures/interfaces';
import prisma from '../../../../structures/database';

interface body {
	id: number;
}

export const middlewares = ['auth', 'admin'];

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	if (!req.body) return res.status(400).send({ message: 'No body provided' });
	const { id } = req.body as body;
	if (!id) return res.status(400).send({ message: 'No id provided' });
	if (id === req.user.id) return res.status(400).send({ message: 'You can\'t apply this action to yourself' });

	await prisma.users.update({
		where: {
			id
		},
		data: {
			isAdmin: false
		}
	});

	return res.send({
		message: 'Successfully demoted user'
	});
};
