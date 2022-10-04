import type { Response } from 'hyper-express';
import prisma from '../../../structures/database';
import { RequestWithUser } from '../../../structures/interfaces';

export const options = {
	url: '/album/:uuid/link/:identifier',
	method: 'delete',
	middlewares: ['auth']
};

export const run = async (req: RequestWithUser, res: Response) => {
	const { uuid, identifier } = req.path_parameters;
	if (!uuid || !identifier) return res.status(400).json({ message: 'No uuid or identifier provided' });

	const album = await prisma.albums.findFirst({
		where: {
			uuid,
			userId: req.user.id
		}
	});

	if (!album) return res.status(400).json({ message: "Album doesn't exist or doesn't belong to the user" });

	const link = await prisma.links.findFirst({
		where: {
			userId: req.user.id,
			albumId: album.id,
			identifier
		}
	});

	if (!link) return res.status(400).json({ message: 'No link found' });

	await prisma.links.delete({
		where: {
			identifier
		}
	});

	return res.json({
		message: 'Successfully deleted the link'
	});
};
