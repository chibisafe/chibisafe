import type { FastifyReply } from 'fastify';
import prisma from '@/structures/database';
import type { RequestWithUser } from '@/structures/interfaces';

export const options = {
	url: '/file/:uuid/tag/:tagUuid',
	method: 'delete',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid, tagUuid } = req.params as { uuid?: string; tagUuid?: string };

	const fileExists = await prisma.files.findFirst({
		where: {
			uuid,
			userId: req.user.id
		}
	});

	if (!fileExists) {
		res.notFound("File doesn't exist or doesn't belong to the user");
		return;
	}

	const tagExists = await prisma.tags.findFirst({
		where: {
			uuid: tagUuid,
			userId: req.user.id
		}
	});

	if (!tagExists) {
		res.notFound("Tag doesn't exist or doesn't belong to the user");
		return;
	}

	await prisma.files.update({
		where: {
			id: fileExists.id
		},
		data: {
			tags: {
				disconnect: {
					id: tagExists.id
				}
			}
		}
	});

	return res.send({
		message: 'Successfully removed tag from file'
	});
};
