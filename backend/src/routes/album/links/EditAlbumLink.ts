import type { Response } from 'hyper-express';
import type { RequestWithUser } from '../../../structures/interfaces';
import prisma from '../../../structures/database';

export const options = {
	url: '/album/:uuid/link/:linkUuid/edit',
	method: 'post',
	middlewares: ['auth']
};

export const run = async (req: RequestWithUser, res: Response) => {
	const { uuid, linkUuid } = req.path_parameters;
	if (!uuid || !linkUuid) return res.status(400).json({ message: 'No uuid or linkUuid provided' });

	const { enabled, enableDownload, expiresAt } = await req.json();

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

	const updateObj = {
		enabled: enabled === true ? true : enabled === false ? false : link.enabled,
		enableDownload: enableDownload === true ? true : enableDownload === false ? false : link.enableDownload,
		expiresAt
	};

	await prisma.links.update({
		where: {
			uuid: linkUuid
		},
		data: {
			...updateObj
		}
	});

	return res.json({
		message: 'Successfully edited link'
	});
};
