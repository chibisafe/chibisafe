import type { Response } from 'hyper-express';
import prisma from '../../structures/database';
import type { RequestWithUser } from '../../structures/interfaces';
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
			id: true, // Don't forget to remove id from the final object as to not expose it to the public
			uuid: true,
			name: true,
			nsfw: true,
			zippedAt: true,
			createdAt: true,
			editedAt: true
		}
	});

	if (!albums.length) return res.status(404).json({ message: 'No albums where found' });

	// TODO: Do a join instead of this to grab the amount of files an album has
	// And since we're at it, grab the first pic uploaded and use it as a thumb

	// TODO: Instead of the first, being able to select a cover picture for an album would
	// be a neat feature

	const fetchedAlbums = [];
	for (const album of albums) {
		const newObject = {
			...album,
			cover: ('' as string) || undefined,
			count: 0
		};

		const fetchRelation = await prisma.albumsFiles.findFirst({
			where: {
				albumId: album.id
			},
			orderBy: {
				id: 'asc'
			}
		});

		if (fetchRelation?.fileId) {
			const fetchFile = await prisma.files.findFirst({
				where: {
					id: fetchRelation?.fileId
				}
			});

			newObject.cover = fetchFile ? constructFilePublicLink(req, fetchFile).thumbSquare : '';
		}

		const filesInAlbum = await prisma.albums.count({
			where: {
				uuid: album.uuid
			}
		});

		fetchedAlbums.push(newObject);
	}

	return res.json({
		message: 'Successfully retrieved albums',
		albums: fetchedAlbums
	});
};
