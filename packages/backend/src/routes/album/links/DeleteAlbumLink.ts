import type { FastifyReply } from 'fastify';
import prisma from '@/structures/database';
import type { RequestWithUser } from '@/structures/interfaces';

export const options = {
	url: '/album/:uuid/link/:linkUuid',
	method: 'delete',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid, linkUuid } = req.params as { uuid: string; linkUuid: string };

	const album = await prisma.albums.findFirst({
		where: {
			uuid,
			userId: req.user.id
		}
	});

	if (!album) {
		res.badRequest("Album doesn't exist or doesn't belong to the user");
		return;
	}

	const link = await prisma.links.findFirst({
		where: {
			userId: req.user.id,
			albumId: album.id,
			uuid: linkUuid
		}
	});

	if (!link) {
		res.notFound('No link found');
		return;
	}

	await prisma.links.delete({
		where: {
			uuid: linkUuid
		}
	});

	return res.send({
		message: 'Successfully deleted the link'
	});
};
