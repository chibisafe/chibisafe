import path from 'node:path';
import type { FastifyReply } from 'fastify';
import jetpack from 'fs-jetpack';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { deleteFile, quarantinePath, uploadPath } from '@/utils/File.js';

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
			name: true,
			quarantine: true,
			quarantineFile: true
		}
	});

	if (!file) {
		void res.notFound("The file doesn't exist");
		return;
	}

	if (file.quarantine) {
		await prisma.files.update({
			where: {
				uuid
			},
			data: {
				quarantine: false,
				quarantineFile: {
					delete: true
				}
			}
		});

		await jetpack.moveAsync(path.join(quarantinePath, file.quarantineFile!.name), path.join(uploadPath, file.name));
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
