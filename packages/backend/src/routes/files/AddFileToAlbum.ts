import type { FastifyReply } from 'fastify';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { saveFileToAlbum } from '@/utils/File.js';

export const options = {
	url: '/file/:uuid/album/:albumUuid',
	method: 'post',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid, albumUuid } = req.params as { albumUuid: string; uuid: string };

	const fileExists = await prisma.files.findFirst({
		where: {
			uuid,
			userId: req.user.id
		}
	});

	if (!fileExists) {
		void res.notFound("File doesn't exist or doesn't belong to the user");
		return;
	}

	const albumExists = await prisma.albums.findFirst({
		where: {
			uuid: albumUuid,
			userId: req.user.id
		},
		select: {
			id: true
		}
	});

	if (!albumExists) {
		void res.notFound("Album doesn't exist or doesn't belong to the user");
		return;
	}

	await saveFileToAlbum(albumExists.id, fileExists.id);

	return res.send({
		message: 'Successfully added file to album'
	});
};
