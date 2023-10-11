import type { FastifyReply } from 'fastify';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';

export const options = {
	url: '/tags',
	method: 'get',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const tags = await prisma.tags.findMany({
		where: {
			userId: req.user.id
		},
		select: {
			uuid: true,
			name: true,
			_count: {
				select: {
					files: true
				}
			}
		}
	});

	return res.send({
		message: 'Successfully fetched tags',
		tags
	});
};
