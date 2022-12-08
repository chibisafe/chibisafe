import type { Response } from 'hyper-express';
import prisma from '../../structures/database';
import { constructFilePublicLink } from '../../utils/File';
import type { ExtendedFile, File, RequestWithUser } from '../../structures/interfaces';

export const options = {
	url: '/album/:uuid',
	method: 'get',
	middlewares: ['auth']
};

export const run = async (req: RequestWithUser, res: Response) => {
	const { uuid } = req.path_parameters;
	if (!uuid) return res.status(400).json({ message: 'Invalid uuid supplied' });

	// Make sure the public link exists and it's enabled
	const album = await prisma.albums.findFirst({
		where: {
			uuid,
			userId: req.user.id
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
			name: true,
			type: true
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

	return res.json({
		message: 'Successfully retrieved album',
		name: album.name,
		files: parsedFiles,
		isNsfw: album.nsfw,
		filesCount: fileCount
	});
};
