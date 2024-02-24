import { Buffer } from 'node:buffer';
import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { basename } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import type { FastifyReply } from 'fastify';
import { fileTypeFromBuffer } from 'file-type';
import { setOptions, unzip } from 'unzipit';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { responseMessageSchema } from '@/structures/schemas/ResponseMessage.js';
import { handleUploadFile } from '@/utils/File.js';

const require = createRequire(import.meta.url);
setOptions({
	workerURL: require.resolve('unzipit/dist/unzipit-worker.js'),
	numWorkers: 2
});

export const schema = {
	summary: 'Unzip file',
	description: 'Unzips a file',
	tags: ['Files'],
	params: z
		.object({
			uuid: z.string().describe('The uuid of the file.')
		})
		.required(),
	response: {
		200: z.object({
			message: responseMessageSchema
		}),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	// url: '/admin/file/:uuid/unzip',
	method: 'post',
	middlewares: ['apiKey', 'auth', 'admin']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid } = req.params as { uuid: string };

	const file = await prisma.files.findFirst({
		where: {
			userId: req.user.id,
			uuid
		},
		select: {
			uuid: true,
			name: true,
			quarantine: true,
			quarantineFile: true,
			isS3: true,
			isWatched: true
		}
	});

	if (!file) {
		void res.notFound("The file doesn't exist or doesn't belong to the user");
		return;
	}

	const tmpDir = fileURLToPath(new URL('../../../../../uploads/tmp', import.meta.url));

	const zipPath = fileURLToPath(new URL(`../../../../../uploads/${file.name}`, import.meta.url));
	const buffer = await readFile(zipPath);
	try {
		const { entries } = await unzip(new Uint8Array(buffer));

		for (const entry of Object.values(entries)) {
			if (entry.isDirectory) {
				continue;
			}

			const filename = basename(entry.name);
			const fileBuffer = Buffer.from(await entry.arrayBuffer());
			await writeFile(`${tmpDir}/${filename}`, fileBuffer);
			const mimeType = await fileTypeFromBuffer(fileBuffer);

			void handleUploadFile({
				user: req.user,
				ip: req.ip,
				upload: {
					name: entry.name,
					path: `${tmpDir}/${filename}`,
					type: mimeType?.mime ?? 'application/octet-stream',
					size: String(entry.size)
				}
			});
		}
	} catch (error) {
		req.log.error(`There was an error unzipping the file at < ${zipPath} >`);
		req.log.error(error);
		void res.badRequest('An error occurred while unzipping the file');
		return;
	}

	return res.send({
		message: 'Successfully unzipped the file'
	});
};
