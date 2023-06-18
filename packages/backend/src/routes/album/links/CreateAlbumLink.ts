import type { FastifyReply } from 'fastify';
import prisma from '@/structures/database';
import type { RequestWithUser } from '@/structures/interfaces';
import { getUniqueAlbumIdentifier } from '@/utils/Util';
import { v4 as uuidv4 } from 'uuid';

export const options = {
	url: '/album/:uuid/link',
	method: 'post',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid } = req.params as { uuid: string };
	if (!uuid) return res.code(400).send({ message: 'No uuid provided' });

	const exists = await prisma.albums.findFirst({
		where: {
			uuid,
			userId: req.user.id
		}
	});

	if (!exists) return res.code(400).send({ message: "Album doesn't exist or doesn't belong to the user" });

	let { identifier } = req.body as { identifier?: string };
	if (identifier) {
		if (!req.user.isAdmin) return res.code(401).send({ message: 'Only administrators can create custom links' });
		if (!/^[\w-]+$/.test(identifier))
			return res
				.status(400)
				.send({ message: 'Only alphanumeric, dashes, and underscore characters are allowed' });

		const identifierExists = await prisma.links.findFirst({
			where: {
				identifier
			}
		});
		if (identifierExists) return res.code(400).send({ message: 'Album with this identifier already exists' });
	} else {
		identifier = await getUniqueAlbumIdentifier();
		if (!identifier) return res.code(500).send({ message: 'There was a problem allocating a link for your album' });
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

	return res.send({
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
