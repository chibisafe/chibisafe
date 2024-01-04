import type { FastifyReply } from 'fastify';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';

export const options = {
	url: '/tag/:uuid',
	method: 'delete',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid } = req.params as { uuid?: string };
	if (!uuid) {
		void res.badRequest('No uuid provided');
		return;
	}

	const tag = await prisma.tags.findFirst({
		where: {
			userId: req.user.id,
			uuid
		}
	});

	if (!tag) {
		void res.notFound("The tag doesn't exist or doesn't belong to the user");
		return;
	}

	await prisma.tags.delete({
		where: {
			uuid
		}
	});

	return res.send({
		message: 'Successfully deleted the tag'
	});
};
