import type { FastifyReply } from 'fastify';
import prisma from '@/structures/database.js';
import type { RequestWithUser, Album } from '@/structures/interfaces.js';
import { constructFilePublicLink } from '@/utils/File.js';

export const options = {
	url: '/albums',
	method: 'get',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const albums = await prisma.albums.findMany({
		where: {
			userId: req.user.id
		},
		select: {
			uuid: true,
			name: true,
			description: true,
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
		},
		orderBy: {
			name: 'desc'
		}
	});

	if (!albums.length)
		return res.send({
			message: 'Successfully retrieved albums',
			albums: []
		});

	// TODO: Instead of the first, being able to select a cover picture for an album would
	// be a neat feature

	const fetchedAlbums = [];
	for (const album of albums) {
		const newObject = {
			...album,
			cover: ('' as string) || undefined,
			count: album._count.files
			// file.size is BigInt because of prisma, so we need to convert it to a number
		} as unknown as Partial<Album>;

		delete newObject.files;
		delete newObject._count;

		newObject.cover = album.files[0]
			? constructFilePublicLink({ req, fileName: album.files[0].name as unknown as any }).thumbSquare
			: '';
		fetchedAlbums.push(newObject);
	}

	return res.send({
		message: 'Successfully retrieved albums',
		albums: fetchedAlbums
	});
};
