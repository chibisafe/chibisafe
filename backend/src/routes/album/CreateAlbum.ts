import type { Response } from 'hyper-express';
import prisma from '../../structures/database';
import type { RequestWithUser } from '../../structures/interfaces';
import { v4 as uuidv4 } from 'uuid';
import { utc } from 'moment';

export const options = {
	url: '/album/create',
	method: 'post',
	middlewares: ['auth']
};

export const run = async (req: RequestWithUser, res: Response) => {
	const { name } = await req.json();
	if (!name) return res.status(400).json({ message: 'No name provided' });

	const exists = await prisma.albums.findFirst({
		where: {
			name,
			userId: req.user.id
		}
	});

	if (exists) return res.status(400).json({ message: "There's already an album with that name" });

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

	return res.json({
		message: 'Successfully created album',
		data: {
			uuid: newAlbum.uuid,
			name: newAlbum.name,
			createdAt: newAlbum.createdAt
		}
	});
};
