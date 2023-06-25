import type { FastifyReply } from 'fastify';
import prisma from '@/structures/database';
import type { RequestWithUser } from '@/structures/interfaces';
import { deleteFile } from '@/utils/File';

export const options = {
	url: '/admin/file/:uuid',
	method: 'delete',
	middlewares: ['auth', 'admin']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid } = req.params as { uuid: string };

	const file = await prisma.files.findFirst({
		where: {
			uuid
		}
	});

	if (!file) {
		res.notFound("The file doesn't exist");
		return;
	}

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
