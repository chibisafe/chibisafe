import type { FastifyReply } from 'fastify';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';

export const options = {
	url: '/admin/invite/delete',
	method: 'post',
	middlewares: ['apiKey', 'auth', 'admin']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { code }: { code: string } = req.body as { code: string };
	if (!code) {
		void res.badRequest('No code provided');
		return;
	}

	const invite = await prisma.invites.findUnique({
		where: {
			code
		}
	});

	if (invite?.used) {
		void res.notFound('Invite has already been used');
		return;
	}

	await prisma.invites.delete({
		where: {
			code
		}
	});

	return res.send({ message: 'Successfully deleted invite' });
};
