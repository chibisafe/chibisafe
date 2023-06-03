import type { FastifyReply } from 'fastify';
import type { RequestWithUser } from '../../../structures/interfaces';
import prisma from '../../../structures/database';

export const options = {
	url: '/album/:uuid/link/:linkUuid/edit',
	method: 'post',
	middlewares: ['auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid, linkUuid } = req.params as { uuid?: string; linkUuid?: string };
	if (!uuid || !linkUuid) return res.code(400).send({ message: 'No uuid or linkUuid provided' });

	const { enabled, enableDownload, expiresAt } = req.body as {
		enabled?: boolean;
		enableDownload?: boolean;
		expiresAt?: Date;
	};

	const album = await prisma.albums.findFirst({
		where: {
			uuid,
			userId: req.user.id
		}
	});

	if (!album) return res.code(400).send({ message: "Album doesn't exist or doesn't belong to the user" });

	const link = await prisma.links.findFirst({
		where: {
			userId: req.user.id,
			albumId: album.id,
			uuid: linkUuid
		}
	});

	if (!link) return res.code(400).send({ message: 'No link found' });

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

	return res.send({
		message: 'Successfully edited link'
	});
};
