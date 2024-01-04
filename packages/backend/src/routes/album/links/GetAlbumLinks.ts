import type { FastifyReply } from 'fastify';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';

export const options = {
	url: '/album/:uuid/links',
	method: 'get',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid } = req.params as { uuid: string };
	if (!uuid) {
		void res.badRequest('Invalid uuid supplied');
		return;
	}

	const album = await prisma.albums.findFirst({
		where: {
			uuid,
			userId: req.user.id
		},
		select: {
			id: true
		}
	});

	if (!album) {
		void res.badRequest("Album doesn't exist or doesn't belong to the user");
		return;
	}

	const links = await prisma.links.findMany({
		where: {
			albumId: album.id,
			userId: req.user.id
		},
		select: {
			uuid: true,
			identifier: true,
			views: true,
			enabled: true,
			enableDownload: true,
			expiresAt: true,
			createdAt: true,
			editedAt: true
		}
	});

	return res.send({
		message: 'Successfully retrieved links',
		links
	});
};
