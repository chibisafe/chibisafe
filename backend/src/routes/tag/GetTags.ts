import type { FastifyReply } from 'fastify';
import prisma from '../../structures/database';
import type { RequestWithUser } from '../../structures/interfaces';

export const options = {
	url: '/tags',
	method: 'get',
	middlewares: ['auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const tags = await prisma.tags.findMany({
		where: {
			userId: req.user.id
		}
	});

	return res.send({
		message: 'Successfully fetched tags',
		data: tags
	});
};
