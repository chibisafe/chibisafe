import fs from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';
import { finished } from 'node:stream/promises';
import { URL, fileURLToPath } from 'node:url';
import type { FastifyReply } from 'fastify';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { SETTINGS } from '@/structures/settings.js';
import { deleteTmpFile } from '@/utils/File.js';
import { generateThumbnails, imageExtensions, videoExtensions } from '@/utils/Thumbnails.js';

export const options = {
	url: '/file/:uuid/thumbnail/regenerate',
	method: 'post',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid } = req.params as { uuid: string };

	// Make sure the file exists and belongs to the user
	const file = await prisma.files.findFirst({
		where: {
			uuid,
			userId: req.user.id
		},
		select: {
			name: true,
			isS3: true,
			size: true
		}
	});

	if (!file) {
		void res.notFound('The file could not be found');
		return;
	}

	if (file.isS3) {
		const fileURL = `${SETTINGS.S3PublicUrl || SETTINGS.S3Endpoint}/${file.name}`;

		const tmpDir = fileURLToPath(new URL('../../../../../uploads/tmp', import.meta.url));
		const newPath = `${tmpDir}/${file.name}`;

		const extension = path.extname(file.name);
		const needsThumbnails = [...imageExtensions, ...videoExtensions].includes(extension);
		const maxFileSizeForThumbnails = 100 * 1024 * 1024; // 100Mb

		if (needsThumbnails && Number.parseInt(file.size, 10) <= maxFileSizeForThumbnails) {
			try {
				const fetchResponse = await fetch(fileURL);
				if (!fetchResponse.body) return await res.internalServerError('Failed to fetch file');

				// @ts-expect-error wrong types
				await finished(Readable.fromWeb(fetchResponse.body).pipe(fs.createWriteStream(newPath)));
			} catch (error) {
				req.log.error(error);
				void deleteTmpFile(newPath);
				return res.internalServerError('Failed to fetch file');
			}
		}
	}

	void generateThumbnails(file.name, file.isS3);

	return res.send({
		message: 'Successfully regenerated file thumbnail'
	});
};
