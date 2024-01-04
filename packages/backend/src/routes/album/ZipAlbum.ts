import { URL, fileURLToPath } from 'node:url';
import type { FastifyRequest, FastifyReply } from 'fastify';
import jetpack from 'fs-jetpack';
import moment from 'moment';
import prisma from '@/structures/database.js';
import { SETTINGS } from '@/structures/settings.js';
import { createZip } from '@/utils/File.js';

export const options = {
	// url: '/album/:identifier/zip',
	method: 'get'
};

export const run = async (req: FastifyRequest, res: FastifyReply) => {
	const { identifier } = req.params as { identifier: string };
	if (!identifier) {
		void res.badRequest('No identifier provided');
		return;
	}

	// Make sure the album identifier exists and is enabled
	const link = await prisma.links.findFirst({
		where: {
			identifier,
			enabled: true,
			enableDownload: true
		}
	});

	if (!link) {
		void res.notFound('No identifier could be found');
		return;
	}

	// Make sure the album exists
	const album = await prisma.albums.findFirst({
		where: {
			id: link.albumId
		},
		select: {
			uuid: true,
			zippedAt: true,
			editedAt: true,
			files: {
				select: {
					name: true
				}
			}
		}
	});

	if (!album) {
		void res.notFound('No album could be found');
		return;
	}

	// If the date the album was zipped is greater than the date the album was last updated, send the zip
	if (album.zippedAt && album.editedAt && album.zippedAt > album.editedAt) {
		const filePath = fileURLToPath(new URL(`../../../../../uploads/zips/${album.uuid}.zip`, import.meta.url));
		const exists = await jetpack.existsAsync(filePath);

		if (exists) {
			const fileName = `${SETTINGS.serviceName}-${identifier}.zip`;
			await res.download(filePath, fileName);
			return;
		}
	}

	const filesToZip = album.files.map((file: any) => file.name);

	try {
		createZip(filesToZip, album.uuid);
		await prisma.albums.update({
			where: {
				uuid: album.uuid
			},
			data: {
				zippedAt: moment.utc().toDate()
			}
		});

		const filePath = fileURLToPath(new URL(`../../../../../uploads/zips/${album.uuid}.zip`, import.meta.url));
		const fileName = `${SETTINGS.serviceName}-${identifier}.zip`;
		await res.download(filePath, fileName);
	} catch (error) {
		res.log.error(error);
		void res.internalServerError('There was a problem downloading the album');
	}
};
