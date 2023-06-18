import type { FastifyReply } from 'fastify';
import prisma from '@/structures/database';
import type { RequestWithUser } from '@/structures/interfaces';

export const options = {
	url: '/album/:uuid/link/:linkUuid',
	method: 'delete',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid, linkUuid } = req.params as { uuid?: string; linkUuid?: string };
	if (!uuid || !linkUuid) return res.code(400).send({ message: 'No uuid or linkUuid provided' });

	const album = await prisma.albums.findFirst({
		where: {
			uuid,
			userId: req.user.id
		}
	});

	if (!album) return res.code(400).send({ message: "Album doesn't exist or doesn't belong to the user" });

	const link = await prisma.links.findFirst({
		where: {
			userId: req.user.id,
			albumId: album.id,
			uuid: linkUuid
		}
	});

	if (!link) return res.code(400).send({ message: 'No link found' });

	await prisma.links.delete({
		where: {
			uuid: linkUuid
		}
	});

	return res.send({
		message: 'Successfully deleted the link'
	});
};
