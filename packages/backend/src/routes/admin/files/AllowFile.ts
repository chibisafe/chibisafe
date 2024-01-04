import path from 'node:path';
import type { FastifyReply } from 'fastify';
import jetpack from 'fs-jetpack';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { quarantinePath, uploadPath } from '@/utils/File.js';
import { generateThumbnails } from '@/utils/Thumbnails.js';

export const options = {
	url: '/admin/file/:uuid/allow',
	method: 'post',
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
			quarantineFile: true
		}
	});

	if (!file) {
		void res.notFound("The file doesn't exist");
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
