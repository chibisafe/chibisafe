import type { FastifyReply } from 'fastify';
import prisma from '../../../../structures/database';
import { RequestWithUser } from '../../../../structures/interfaces';
import { getUniqueAlbumIdentifier } from '../../../../utils/Util';

interface body {
	albumId: number;
	identifier?: string;
}

export const middlewares = ['auth'];

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	if (!req.params) return res.status(400).send({ message: 'No body provided' });
	const { albumId } = req.body as body;
	if (!albumId) return res.status(400).send({ message: 'No albumId provided' });

	const exists = await prisma.albums.findFirst({
		where: {
			id: albumId,
			userId: req.user.id
		}
	});

	if (!exists) return res.status(400).send({ message: 'Album doesn\t exist' });

	let { identifier } = req.body as body;
	if (identifier) {
		if (!req.user.isAdmin) return res.status(401).send({ message: 'Only administrators can create custom links' });
		if (!(/^[a-zA-Z0-9-_]+$/.test(identifier))) return res.status(400).send({ message: 'Only alphanumeric, dashes, and underscore characters are allowed' });

		const identifierExists = await prisma.links.findFirst({
			where: {
				identifier
			}
		});
		if (identifierExists) return res.status(400).send({ message: 'Album with this identifier already exists' });
	} else {
		identifier = await getUniqueAlbumIdentifier();
		if (!identifier) return res.status(500).send({ message: 'There was a problem allocating a link for your album' });
	}

	const insertObj = {
		identifier,
		userId: req.user.id,
		albumId,
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
		data: insertObj
	});
};
