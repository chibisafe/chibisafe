import type { Response } from 'hyper-express';
import prisma from '../../structures/database';
import { constructFilePublicLink } from '../../utils/File';
import type { ExtendedFile, RequestWithUser } from '../../structures/interfaces';

export const options = {
	url: '/file/:uuid',
	method: 'get',
	middlewares: ['auth']
};

export const run = async (req: RequestWithUser, res: Response) => {
	const { uuid } = req.path_parameters;
	if (!uuid) return res.status(400).json({ message: 'Invalid uuid supplied' });

	// Make sure the file exists and belongs to the user
	const file = await prisma.files.findFirst({
		where: {
			uuid,
			userId: req.user.id
		}
	});

	if (!file) return res.status(404).json({ message: 'The file could not be found' });

	// TODO: Figure out how to join with prisma, probably need to update the schema for it
	const albumsFiles = await prisma.albumsFiles.findMany({
		where: {
			fileId: file.id
		},
		select: {
			albumId: true
		}
	});

	// Grab all the albums the file is part of
	const albums = await prisma.albums.findMany({
		where: {
			id: {
				in: albumsFiles.map(af => af.albumId)
			}
		},
		select: {
			uuid: true,
			name: true
		},
		orderBy: {
			id: 'desc'
		}
	});

	// Grab all the tags the file is part of
	const fileTags = await prisma.fileTags.findMany({
		where: {
			fileId: file.id
		},
		select: {
			tagId: true
		}
	});

	const tags = await prisma.tags.findMany({
		where: {
			id: {
				in: fileTags.map(ft => ft.tagId)
			}
		},
		select: {
			uuid: true,
			name: true
		},
		orderBy: {
			id: 'desc'
		}
	});

	// Build the public links
	let parsedFile: ExtendedFile = file;
	parsedFile = constructFilePublicLink(req, file);

	return res.json({
		message: 'Successfully retrieved file',
		file: parsedFile,
		albums,
		tags
	});
};
