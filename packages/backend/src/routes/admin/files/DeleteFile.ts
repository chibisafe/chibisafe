import type { FastifyReply } from 'fastify';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { deleteFiles } from '@/utils/File.js';

export const options = {
	url: '/admin/file/:uuid',
	method: 'delete',
	middlewares: ['apiKey', 'auth', 'admin']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid } = req.params as { uuid: string };

	const file = await prisma.files.findFirst({
		where: {
			uuid,
			quarantine: true
		},
		select: {
			uuid: true,
			name: true,
			quarantine: true,
			quarantineFile: true,
			isS3: true
		}
	});

	if (!file) {
		void res.notFound("The file doesn't exist");
		return;
	}

	// Delete the file from the DB
	await prisma.files.delete({
		where: {
			uuid
		}
	});

	// Remove the file from disk
	await deleteFiles({ files: [file] });

	return res.send({
		message: 'Successfully deleted the file'
	});
};
