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
			for anyone consuming the API outside of the lolisafe frontend.
		*/
		const albums = await db.table('albums')
			.where('albums.userId', user.id)
			.select('id', 'name', 'editedAt');

		for (const album of albums) {
			// TODO: Optimize the shit out of this. Ideally a JOIN that grabs all the needed stuff in 1 query instead of 3

			// Fetch the total amount of files each album has.
			const fileCount = await db.table('albumsFiles') // eslint-disable-line no-await-in-loop
				.where('albumId', album.id)
				.count({ count: 'id' });

			// Fetch the file list from each album but limit it to 5 per album
			const filesToFetch = await db.table('albumsFiles') // eslint-disable-line no-await-in-loop
				.where('albumId', album.id)
				.select('fileId')
				.orderBy('id', 'desc')
				.limit(5);

			// Fetch the actual files
			const files = await db.table('files') // eslint-disable-line no-await-in-loop
				.whereIn('id', filesToFetch.map(el => el.fileId))
				.select('id', 'name');

			// Fetch thumbnails and stuff
			for (let file of files) {
				file = Util.constructFilePublicLink(file);
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
		const albums = await db.table('albums')
			.where('userId', user.id)
			.select('id', 'name');
		return res.json({
			message: 'Successfully retrieved albums',
			albums
		});
	}
}

module.exports = [albumsGET, albumsDropdownGET];
