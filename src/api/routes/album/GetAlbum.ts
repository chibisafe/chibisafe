import type { Request, Response } from 'hyper-express';
import prisma from '../../structures/database';
import { constructFilePublicLink } from '../../utils/File';
import type { ExtendedFile, File } from '../../structures/interfaces';

export const url = '/album/:uuid/';
export const method = 'GET';
export const middlewares = ['auth'];

export const run = async (req: Request, res: Response) => {
	const { identifier } = req.path_parameters;
	if (!identifier) return res.status(400).json({ message: 'Invalid identifier supplied' });

	// Make sure the public link exists and it's enabled
	const link = await prisma.links.findFirst({
		where: {
			identifier,
			enabled: true
		}
	});
	if (!link) return res.status(404).json({ message: 'The album link could not be found' });

	// Now check if the album exists
	const album = await prisma.albums.findFirst({
		where: {
			id: link.albumId
		}
	});
	if (!album) return res.status(404).json({ message: 'The album could not be found' });

	// TODO: Figure out how to join with prisma, probably need to update the schema for it
	const albumsFiles = await prisma.albumsFiles.findMany({
		where: {
			albumId: album.id
		},
		select: {
			fileId: true
		}
	});

	// Set up pagination options
	const { page = 1, limit = 50 } = req.query_parameters as { page?: number; limit?: number };
	const options = {
		take: limit,
		skip: (page - 1) * limit
	};

	// Grab all the files
	const files = (await prisma.files.findMany({
		where: {
			id: {
				in: albumsFiles.map(af => af.fileId)
			}
		},
		select: {
			uuid: true,
			name: true
		},
		orderBy: {
			id: 'desc'
		},
		...options
	})) as File[];

	// Count total files in album
	const fileCount = await prisma.files.count({
		where: {
			id: {
				in: albumsFiles.map(af => af.fileId)
			}
		}
	});

	// Build the public links
	const parsedFiles: ExtendedFile[] = [];
	for (const file of files) {
		parsedFiles.push(constructFilePublicLink(req, file));
	}

	// Update the amount of views on the album
	await prisma.links.update({
		where: {
			id: link.albumId
		},
		data: {
			views: link.views + 1
		}
	});

	return res.json({
		message: 'Successfully retrieved album',
		name: album.name,
		files: parsedFiles,
		isNsfw: album.nsfw,
		count: fileCount
	});
};
