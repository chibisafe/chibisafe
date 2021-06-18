/* eslint-disable max-classes-per-file */
const Route = require('../../structures/Route');
const Util = require('../../utils/Util');

class albumsGET extends Route {
	constructor() {
		super('/albums/mini', 'get');
	}

	async run(req, res, db, user) {
		/*
			Let's fetch the albums. This route will only return a small portion
			of the album files for displaying on the dashboard. It's probably useless
			for anyone consuming the API outside of the chibisafe frontend.
		*/
		const albums = await db
			.table('albums')
			.where('albums.userId', user.id)
			.select('id', 'name', 'nsfw', 'createdAt', 'editedAt')
			.orderBy('createdAt', 'desc');

		for (const album of albums) {
			// Fetch the total amount of files each album has.
			const fileCount = await db // eslint-disable-line no-await-in-loop
				.table('albumsFiles')
				.where('albumId', album.id)
				.count({ count: 'id' });

			// Fetch the file list from each album but limit it to 5 per album
			const files = await db // eslint-disable-line no-await-in-loop
				.table('albumsFiles')
				.join('files', { 'files.id': 'albumsFiles.fileId' })
				.where('albumId', album.id)
				.select('files.id', 'files.name')
				.orderBy('albumsFiles.id', 'desc')
				.limit(5);

			// Fetch thumbnails and stuff
			for (let file of files) {
				file = Util.constructFilePublicLink(req, file);
			}

			album.fileCount = fileCount[0].count;
			album.files = files;
		}

		return res.json({
			message: 'Successfully retrieved albums',
			albums
		});
	}
}

class albumsDropdownGET extends Route {
	constructor() {
		super('/albums/dropdown', 'get', { canApiKey: true });
	}

	async run(req, res, db, user) {
		const albums = await db
			.table('albums')
			.where('userId', user.id)
			.select('id', 'name');
		return res.json({
			message: 'Successfully retrieved albums',
			albums
		});
	}
}

module.exports = [albumsGET, albumsDropdownGET];
