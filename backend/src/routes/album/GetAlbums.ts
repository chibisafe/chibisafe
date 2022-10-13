import type { Response } from 'hyper-express';
import prisma from '../../structures/database';
import type { RequestWithUser } from '../../structures/interfaces';

export const options = {
	url: '/albums',
	method: 'get',
	middlewares: ['auth', 'apiKey']
};

export const run = async (req: RequestWithUser, res: Response) => {
	const albums = await prisma.albums.findMany({
		where: {
			userId: req.user.id
		},
		select: {
			uuid: true,
			name: true,
			nsfw: true,
			zippedAt: true,
			createdAt: true,
			editedAt: true
		}
	});

	if (!albums.length) return res.status(404).json({ message: 'No albums where found' });

	return res.json({
		message: 'Successfully retrieved albums',
		albums
	});
};
