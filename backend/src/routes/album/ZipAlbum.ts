import type { Request, Response } from 'hyper-express';
import prisma from '../../structures/database';
import jetpack from 'fs-jetpack';
import path from 'node:path';
import { getEnvironmentDefaults } from '../../utils/Util';
import { createZip } from '../../utils/File';
import { utc } from 'moment';
import log from '../../utils/Log';

export const options = {
	url: '/album/:identifier/zip',
	method: 'get'
};

export const run = async (req: Request, res: Response) => {
	const { identifier } = req.path_parameters;
	if (!identifier) return res.status(400).json({ message: 'No identifier provided' });

	// TODO: Do we let anyone create a zip?

	// Make sure the album identifier exists and is enabled
	const link = await prisma.links.findFirst({
		where: {
			identifier,
			enabled: true,
			enableDownload: true
		}
	});

	if (!link) return res.status(400).json({ message: 'No identifier could be found' });

	// Make sure the album exists
	const album = await prisma.albums.findFirst({
		where: {
			id: link.albumId
		}
	});

	if (!album) return res.status(400).json({ message: 'No album could be found' });

	// If the date the album was zipped is greater than the date the album was last updated, send the zip
	if (album.zippedAt && album.editedAt && album.zippedAt > album.editedAt) {
		const filePath = path.join(__dirname, '../../../../uploads', 'zips', `${album.uuid}.zip`);
		const exists = await jetpack.existsAsync(filePath);

		if (exists) {
			const fileName = `${getEnvironmentDefaults().serviceName}-${identifier}.zip`;
			res.download(filePath, fileName);
			return;
		}

		// TODO: If the conditional above is false, generate the file again?
	}

	const fileList = await prisma.albumsFiles.findMany({
		where: {
			albumId: album.id
		},
		select: {
			fileId: true
		}
	});

	if (!fileList.length) return res.status(400).json({ message: 'No files could be found' });

	const files = await prisma.files.findMany({
		where: {
			id: {
				in: fileList.map(file => file.fileId)
			}
		},
		select: {
			name: true
		}
	});

	const filesToZip = files.map(file => file.name);

	try {
		createZip(filesToZip, album);
		await prisma.albums.update({
			where: {
				id: album.id
			},
			data: {
				zippedAt: utc().toDate()
			}
		});

		const filePath = path.join(__dirname, '../../../../uploads', 'zips', `${album.uuid}.zip`);
		const fileName = `${getEnvironmentDefaults().serviceName}-${identifier}.zip`;
		res.download(filePath, fileName);
		return;
	} catch (error) {
		log.error(error);
		return res.status(500).json({ message: 'There was a problem downloading the album' });
	}
};
