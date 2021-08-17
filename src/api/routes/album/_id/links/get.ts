import type { FastifyReply } from 'fastify';
import type { RequestWithUser } from '../../../../structures/interfaces';
import prisma from '../../../../structures/database';

interface params {
	id: number;
}

export const middlewares = ['auth'];

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { id } = req.params as params;
	if (!id) return res.status(400).send({ message: 'Invalid id supplied' });

	const links = await prisma.links.findMany({
		where: {
			albumId: id,
			userId: req.user.id
		}
	});

	return res.send({
		message: 'Successfully retrieved links',
		links
	});
};
