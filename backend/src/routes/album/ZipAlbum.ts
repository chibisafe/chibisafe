import type { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '../../structures/database';
import jetpack from 'fs-jetpack';
import path from 'node:path';
import { SETTINGS } from '../../structures/settings';
import { createZip } from '../../utils/File';
import { utc } from 'moment';

export const options = {
	url: '/album/:identifier/zip',
	method: 'get'
};

export const run = async (req: FastifyRequest, res: FastifyReply) => {
	const { identifier } = req.params as { identifier: string };
	if (!identifier) return res.code(400).send({ message: 'No identifier provided' });

	// Make sure the album identifier exists and is enabled
	const link = await prisma.links.findFirst({
		where: {
			identifier,
			enabled: true,
			enableDownload: true
		}
	});

	if (!link) return res.code(400).send({ message: 'No identifier could be found' });

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

	if (!album) return res.code(400).send({ message: 'No album could be found' });

	// If the date the album was zipped is greater than the date the album was last updated, send the zip
	if (album.zippedAt && album.editedAt && album.zippedAt > album.editedAt) {
		const filePath = path.join(__dirname, '../../../../uploads', 'zips', `${album.uuid}.zip`);
		const exists = await jetpack.existsAsync(filePath);

		if (exists) {
			const fileName = `${SETTINGS.serviceName}-${identifier}.zip`;
			await res.download(filePath, fileName);
			return;
		}
	}

	const filesToZip = album.files.map(file => file.name);

	try {
		createZip(filesToZip, album.uuid);
		await prisma.albums.update({
			where: {
				uuid: album.uuid
			},
			data: {
				zippedAt: utc().toDate()
			}
		});

		const filePath = path.join(__dirname, '../../../../uploads', 'zips', `${album.uuid}.zip`);
		const fileName = `${SETTINGS.serviceName}-${identifier}.zip`;
		await res.download(filePath, fileName);
		return;
	} catch (error) {
		res.logger.error(error);
		return res.code(500).send({ message: 'There was a problem downloading the album' });
	}
};
