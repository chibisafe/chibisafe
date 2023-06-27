import type { FastifyReply } from 'fastify';
import type { RequestWithUser } from '@/structures/interfaces';
import prisma from '@/structures/database';

export const options = {
	url: '/album/:uuid/link/:linkUuid/edit',
	method: 'post',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid, linkUuid } = req.params as { uuid: string; linkUuid: string };

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

	if (!album) {
		res.badRequest("Album doesn't exist or doesn't belong to the user");
		return;
	}

	const link = await prisma.links.findFirst({
		where: {
			userId: req.user.id,
			albumId: album.id,
			uuid: linkUuid
		}
	});

	if (!link) {
		res.notFound('No link found');
		return;
	}

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
