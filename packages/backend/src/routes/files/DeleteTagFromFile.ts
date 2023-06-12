import type { FastifyReply } from 'fastify';
import prisma from '@/structures/database';
import type { RequestWithUser } from '@/structures/interfaces';

export const options = {
	url: '/file/:uuid/tag/:tagUuid',
	method: 'delete',
	middlewares: ['auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid, tagUuid } = req.params as { uuid?: string; tagUuid?: string };
	if (!uuid || !tagUuid) return res.code(400).send({ message: 'No uuid or tagUuid provided' });

	const fileExists = await prisma.files.findFirst({
		where: {
			uuid,
			userId: req.user.id
		}
	});

	if (!fileExists) return res.code(400).send({ message: "File doesn't exist or doesn't belong to the user" });

	const tagExists = await prisma.tags.findFirst({
		where: {
			uuid: tagUuid,
			userId: req.user.id
		}
	});

	if (!tagExists) return res.code(400).send({ message: "Tag doesn't exist or doesn't belong to the user" });

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
