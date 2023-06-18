import type { FastifyReply } from 'fastify';
import prisma from '@/structures/database';
import type { RequestWithUser } from '@/structures/interfaces';
import { deleteFile } from '@/utils/File';

export const options = {
	url: '/file/:uuid',
	method: 'delete',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid } = req.params as { uuid?: string };
	if (!uuid) return res.code(400).send({ message: 'No uuid provided' });

	const file = await prisma.files.findFirst({
		where: {
			userId: req.user.id,
			uuid
		}
	});

	if (!file) return res.code(400).send({ message: "The file doesn't exist or doesn't belong to the user" });

	// Delete the file from the DB
	await prisma.files.delete({
		where: {
			uuid
		}
	});

	// Remove the file from disk
	await deleteFile(file.name);

	return res.send({
		message: 'Successfully deleted the file'
	});
};
