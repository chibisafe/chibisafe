import type { FastifyReply } from 'fastify';
import prisma from '@/structures/database';
import { saveFileToAlbum } from '@/utils/File';
import type { RequestWithUser } from '@/structures/interfaces';

export const options = {
	url: '/file/:uuid/album/:albumUuid',
	method: 'post',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid, albumUuid } = req.params as { uuid?: string; albumUuid?: string };
	if (!uuid || !albumUuid) return res.code(400).send({ message: 'No uuid or albumUuid provided' });

	const fileExists = await prisma.files.findFirst({
		where: {
			uuid,
			userId: req.user.id
		}
	});

	if (!fileExists) return res.code(400).send({ message: "File doesn't exist or doesn't belong to the user" });

	const albumExists = await prisma.albums.findFirst({
		where: {
			uuid: albumUuid,
			userId: req.user.id
		},
		select: {
			id: true
		}
	});

	if (!albumExists) return res.code(400).send({ message: "Album doesn't exist or doesn't belong to the user" });

	await saveFileToAlbum(albumExists.id, fileExists.id);

	return res.send({
		message: 'Successfully added file to album'
	});
};
