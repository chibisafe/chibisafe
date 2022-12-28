import type { Response } from 'hyper-express';
import prisma from '../../structures/database';
import type { RequestWithUser, Album } from '../../structures/interfaces';
import { constructFilePublicLink } from '../../utils/File';

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
			editedAt: true,
			files: {
				orderBy: {
					id: 'asc'
				},
				take: 1
			},
			_count: true
		}
	});

	if (!albums.length) return res.status(404).json({ message: 'No albums where found' });

	// TODO: Instead of the first, being able to select a cover picture for an album would
	// be a neat feature

	const fetchedAlbums = [];
	for (const album of albums) {
		const newObject = {
			...album,
			cover: ('' as string) || undefined,
			count: album._count.files
		} as Partial<Album>;

		delete newObject.files;
		delete newObject._count;

		newObject.cover = album.files[0] ? constructFilePublicLink(req, album.files[0]).thumbSquare : '';
		fetchedAlbums.push(newObject);
	}

	return res.json({
		message: 'Successfully retrieved albums',
		albums: fetchedAlbums
	});
};
