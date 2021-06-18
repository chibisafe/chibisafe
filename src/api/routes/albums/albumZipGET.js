const path = require('path');
const jetpack = require('fs-jetpack');
const Route = require('../../structures/Route');
const Util = require('../../utils/Util');
const log = require('../../utils/Log');

class albumGET extends Route {
	constructor() {
		super('/album/:identifier/zip', 'get', { bypassAuth: true });
	}

	async run(req, res, db) {
		const { identifier } = req.params;
		if (!identifier) return res.status(400).json({ message: 'Invalid identifier supplied' });

		// TODO: Do we really want to let anyone create a zip of an album?
		/*
			Make sure it exists and it's enabled
		*/
		const link = await db.table('links')
			.where({
				identifier,
				enabled: true,
				enableDownload: true
			})
			.first();
		if (!link) return res.status(400).json({ message: 'The supplied identifier could not be found' });

		/*
			Same with the album, just to make sure is not a deleted album and a leftover link
		*/
		const album = await db.table('albums')
			.where('id', link.albumId)
			.first();
		if (!album) return res.status(400).json({ message: 'Album not found' });

		/*
			If the date when the album was zipped is greater than the album's last edit, we just send the zip to the user
		*/
		if (album.zippedAt > album.editedAt) {
			const filePath = path.join(__dirname, '../../../../uploads', 'zips', `${album.userId}-${album.id}.zip`);
			const exists = await jetpack.existsAsync(filePath);
			/*
				Make sure the file exists just in case, and if not, continue to it's generation.
			*/
			if (exists) {
				const fileName = `${Util.config.serviceName}-${identifier}.zip`;
				return res.download(filePath, fileName);
			}
		}

		/*
			Grab the files in a very unoptimized way. (This should be a join between both tables)
		*/
		const fileList = await db.table('albumsFiles')
			.where('albumId', link.albumId)
			.select('fileId');

		/*
			If there are no files, stop here
		*/
		if (!fileList || !fileList.length) return res.status(400).json({ message: 'Can\'t download an empty album' });

		/*
			Get the actual files
		*/
		const fileIds = fileList.map(el => el.fileId);
		const files = await db.table('files')
			.whereIn('id', fileIds)
			.select('name');
		const filesToZip = files.map(el => el.name);

		try {
			Util.createZip(filesToZip, album);
			await db.table('albums')
				.where('id', link.albumId)
				.update('zippedAt', db.fn.now())
				.wasMutated();

			const filePath = path.join(__dirname, '../../../../uploads', 'zips', `${album.userId}-${album.id}.zip`);
			const fileName = `${Util.config.serviceName}-${identifier}.zip`;
			return res.download(filePath, fileName);
		} catch (error) {
			log.error(error);
			return res.status(500).json({ message: 'There was a problem downloading the album' });
		}
	}
}

module.exports = albumGET;
