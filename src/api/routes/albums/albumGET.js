const Route = require('../../structures/Route');
const config = require('../../../../config');
const db = require('knex')(config.server.database);

class albumGET extends Route {
	constructor() {
		super('/album/:identifier', 'get', { bypassAuth: true });
	}

	async run(req, res) {
		const { identifier } = req.params;
		if (!identifier) return res.status(400).json({ message: 'Invalid identifier supplied' });

		const link = await db.table('links').where({
			identifier,
			enabled: true
		}).first();
		if (!link) return res.status(400).json({ message: 'The identifier supplied could not be found' });

		const album = await db.table('albums').where('id', link.albumId).first();
		if (!album) return res.status(400).json({ message: 'Album not found' });

		const fileList = await db.table('albumsFiles').where('albumId', link.albumId);
		const fileIds = fileList.filter(el => el.file.fileId);
		const files = await db.table('files')
			.where('id', fileIds)
			.select('name');

		return res.json({
			message: 'Successfully retrieved files',
			files
		});
	}
}

module.exports = albumGET;
