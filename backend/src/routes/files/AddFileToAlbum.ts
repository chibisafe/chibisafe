import type { Response } from 'hyper-express';
import prisma from '../../structures/database';
import type { RequestWithUser } from '../../structures/interfaces';

export const options = {
	url: '/file/:uuid/album/:albumUuid',
	method: 'post',
	middlewares: ['auth']
};

export const run = async (req: RequestWithUser, res: Response) => {
	const { uuid, albumUuid } = req.path_parameters;
	if (!uuid || !albumUuid) return res.status(400).json({ message: 'No uuid or albumUuid provided' });

	const fileExists = await prisma.files.findFirst({
		where: {
			uuid,
			userId: req.user.id
		}
	});

	if (!fileExists) return res.status(401).json({ message: "File doesn't exist or doesn't belong to the user" });

	const albumExists = await prisma.albums.findFirst({
		where: {
			uuid: albumUuid,
			userId: req.user.id
		}
	});

	if (!albumExists) return res.status(401).json({ message: "Album doesn't exist or doesn't belong to the user" });

	const relationExists = await prisma.albumsFiles.findFirst({
		where: {
			fileId: fileExists.id,
			albumId: albumExists.id
		}
	});

	if (relationExists) return res.status(400).json({ message: 'The file is already in the album' });

	await prisma.albumsFiles.create({
		data: {
			fileId: fileExists.id,
			albumId: albumExists.id
		}
	});

	return res.json({
		message: 'Successfully added file to album'
	});
};
