import type { FastifyReply } from 'fastify';
import prisma from '../../structures/database';
import type { RequestWithUser } from '../../structures/interfaces';
import { v4 as uuidv4 } from 'uuid';
import { utc } from 'moment';

export const options = {
	url: '/album/create',
	method: 'post',
	middlewares: ['auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { name } = req.body as { name?: string };
	if (!name) return res.code(400).send({ message: 'No name provided' });

	const exists = await prisma.albums.findFirst({
		where: {
			name,
			userId: req.user.id
		}
	});

	if (exists) return res.code(400).send({ message: "There's already an album with that name" });

	const now = utc().toDate();

	const newAlbum = await prisma.albums.create({
		data: {
			name,
			userId: req.user.id,
			uuid: uuidv4(),
			createdAt: now,
			editedAt: now
		}
	});

	return res.send({
		message: 'Successfully created album',
		data: {
			uuid: newAlbum.uuid,
			name: newAlbum.name,
			createdAt: newAlbum.createdAt
		}
	});
};
