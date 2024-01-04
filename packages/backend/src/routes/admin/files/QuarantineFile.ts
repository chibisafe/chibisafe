import path from 'node:path';
import type { FastifyReply } from 'fastify';
import jetpack from 'fs-jetpack';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { deleteThumbnails, getUniqueFileIdentifier, quarantinePath, uploadPath } from '@/utils/File.js';

export const options = {
	url: '/admin/file/:uuid/quarantine',
	method: 'post',
	middlewares: ['apiKey', 'auth', 'admin']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid } = req.params as { uuid: string };
	const { reason }: { reason: string } = req.body as { reason: string };

	const file = await prisma.files.findFirst({
		where: {
			uuid,
			quarantine: false
		}
	});

	if (!file) {
		void res.notFound("The file doesn't exist");
		return;
	}

	const uniqueIdentifier = await getUniqueFileIdentifier();
	const newFileName = String(uniqueIdentifier) + path.extname(file.name);

	await prisma.files.update({
		where: {
			uuid
		},
		data: {
			quarantine: true,
			quarantineFile: {
				create: {
					name: newFileName,
					reason
				}
			}
		}
	});

	await jetpack.moveAsync(path.join(uploadPath, file.name), path.join(quarantinePath, newFileName));
	await deleteThumbnails(file.name);

	return res.send({
		message: 'Successfully quarantined the file'
	});
};
