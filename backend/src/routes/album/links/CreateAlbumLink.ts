import type { Response } from 'hyper-express';
import prisma from '../../../structures/database';
import type { RequestWithUser } from '../../../structures/interfaces';
import { getUniqueAlbumIdentifier } from '../../../utils/Util';
import { v4 as uuidv4 } from 'uuid';

export const options = {
	url: '/album/:uuid/link',
	method: 'post',
	middlewares: ['auth']
};

export const run = async (req: RequestWithUser, res: Response) => {
	const { uuid } = req.path_parameters;
	if (!uuid) return res.status(400).json({ message: 'No uuid provided' });

	const exists = await prisma.albums.findFirst({
		where: {
			uuid,
			userId: req.user.id
		}
	});

	if (!exists) return res.status(400).json({ message: "Album doesn't exist or doesn't belong to the user" });

	let { identifier } = await req.json();
	if (identifier) {
		if (!req.user.isAdmin) return res.status(401).json({ message: 'Only administrators can create custom links' });
		if (!/^[\w-]+$/.test(identifier))
			return res
				.status(400)
				.json({ message: 'Only alphanumeric, dashes, and underscore characters are allowed' });

		const identifierExists = await prisma.links.findFirst({
			where: {
				identifier
			}
		});
		if (identifierExists) return res.status(400).json({ message: 'Album with this identifier already exists' });
	} else {
		identifier = await getUniqueAlbumIdentifier();
		if (!identifier)
			return res.status(500).json({ message: 'There was a problem allocating a link for your album' });
	}

	const insertObj = {
		identifier,
		userId: req.user.id,
		uuid: uuidv4(),
		albumId: exists.id,
		enabled: true,
		enableDownload: true,
		expiresAt: null,
		views: 0
	};

	await prisma.links.create({
		data: insertObj
	});

	return res.json({
		message: 'Successfully created link',
		data: {
			identifier,
			uuid: insertObj.uuid,
			albumId: exists.uuid,
			enabled: insertObj.enabled,
			enableDownload: insertObj.enableDownload,
			expiresAt: insertObj.expiresAt,
			views: insertObj.views
		}
	});
};