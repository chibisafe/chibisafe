import type { FastifyReply } from 'fastify';
import type { RequestWithUser } from '@/structures/interfaces';
import prisma from '@/structures/database';

export const options = {
	url: '/admin/invite/delete',
	method: 'post',
	middlewares: ['auth', 'admin']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { code }: { code: string } = req.body as { code: string };
	if (!code) {
		res.badRequest('No code provided');
		return;
	}

	const invite = await prisma.invites.findUnique({
		where: {
			code
		}
	});

	if (invite?.used) {
		res.notFound('Invite has already been used');
		return;
	}

	await prisma.invites.delete({
		where: {
			code
		}
	});

	return res.send({ message: 'Successfully deleted invite' });
};
