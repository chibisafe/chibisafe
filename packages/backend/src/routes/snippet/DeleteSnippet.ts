import type { FastifyReply } from 'fastify';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';

export const options = {
	url: '/snippet/:uuid',
	method: 'delete',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid } = req.params as { uuid: string };

	const snippet = await prisma.snippets.findFirst({
		where: {
			userId: req.user.id,
			uuid
		},
		select: {
			uuid: true
		}
	});

	if (!snippet) {
		void res.badRequest("The snippet doesn't exist or doesn't belong to the user");
		return;
	}

	await prisma.snippets.delete({
		where: {
			uuid
		}
	});

	return res.send({
		message: 'Successfully deleted snippet'
	});
};
