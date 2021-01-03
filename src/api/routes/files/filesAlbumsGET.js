const Route = require('../../structures/Route');

class filesGET extends Route {
	constructor() {
		super('/file/:id/albums', 'get');
	}

	async run(req, res, db, user) {
		const { id } = req.params;
		if (!id) return res.status(400).json({ message: 'Invalid file ID supplied' });

		const file = await db.table('files').where({ id, userId: user.id }).first();
		if (!file) return res.status(400).json({ message: 'The file doesn\'t exist or doesn\'t belong to the user' });

		let albums = [];
		let albumFiles = await db.table('albumsFiles')
			.where('fileId', id)
			.select('albumId');

		if (albumFiles.length) {
			albumFiles = albumFiles.map(a => a.albumId);
			albums = await db.table('albums')
				.whereIn('id', albumFiles)
				.select('id', 'name');
		}

		return res.json({
			message: 'Successfully retrieved file albums',
			albums
		});
	}
}

module.exports = filesGET;
