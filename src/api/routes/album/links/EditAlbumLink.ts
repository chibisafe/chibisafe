import type { Response } from 'hyper-express';
import type { RequestWithUser } from '../../../structures/interfaces';
import prisma from '../../../structures/database';

export const options = {
	url: '/album/:uuid/link/:identifier/edit',
	method: 'post',
	middlewares: ['auth']
};

export const run = async (req: RequestWithUser, res: Response) => {
	const { uuid, identifier } = req.path_parameters;
	if (!uuid || !identifier) return res.status(400).json({ message: 'No uuid or identifier provided' });

	const { enableDownload, expiresAt } = await req.json();

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

	const updateObj = {
		enableDownload: enableDownload === true ? true : enableDownload === false ? false : link.enableDownload,
		expiresAt
	};

	await prisma.links.update({
		where: {
			identifier
		},
		data: {
			...updateObj
		}
	});

	return res.json({
		message: 'Successfully edited link'
	});
};
