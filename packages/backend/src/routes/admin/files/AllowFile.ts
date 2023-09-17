import type { FastifyReply } from 'fastify';
import prisma from '@/structures/database';
import type { RequestWithUser } from '@/structures/interfaces';
import { deleteThumbnails, quarantinePath, uploadPath } from '@/utils/File';
import jetpack from 'fs-jetpack';
import path from 'node:path';
import { generateThumbnails } from '@/utils/Thumbnails';

export const options = {
	url: '/admin/file/:uuid/allow',
	method: 'post',
	middlewares: ['auth', 'admin']
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
			quarantineFile: true
		}
	});

	if (!file) {
		res.notFound("The file doesn't exist");
		return;
	}

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
	void generateThumbnails(file.name);

	return res.send({
		message: 'Successfully allowed the file'
	});
};
