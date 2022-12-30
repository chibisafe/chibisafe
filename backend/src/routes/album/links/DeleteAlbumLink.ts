import type { Response } from 'hyper-express';
import prisma from '../../../structures/database';
import type { RequestWithUser } from '../../../structures/interfaces';

export const options = {
	url: '/album/:uuid/link/:linkUuid',
	method: 'delete',
	middlewares: ['auth']
};

export const run = async (req: RequestWithUser, res: Response) => {
	const { uuid, linkUuid } = req.path_parameters;
	if (!uuid || !linkUuid) return res.status(400).json({ message: 'No uuid or linkUuid provided' });

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
			uuid: linkUuid
		}
	});

	if (!link) return res.status(400).json({ message: 'No link found' });

	await prisma.links.delete({
		where: {
			uuid: linkUuid
		}
	});

	return res.json({
		message: 'Successfully deleted the link'
	});
};
