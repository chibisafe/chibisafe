const Route = require('../../structures/Route');
const Util = require('../../utils/Util');

class albumGET extends Route {
	constructor() {
		super('/album/:identifier', 'get', { bypassAuth: true });
	}

	async run(req, res, db) {
		const { identifier } = req.params;
		if (!identifier) return res.status(400).json({ message: 'Invalid identifier supplied' });

		// Make sure it exists and it's enabled
		const link = await db.table('links').where({ identifier, enabled: true }).first();
		if (!link) return res.status(404).json({ message: 'The album could not be found' });

		// Same with the album, just to make sure is not a deleted album and a leftover link
		const album = await db.table('albums').where('id', link.albumId).first();
		if (!album) return res.status(404).json({ message: 'Album not found' });

		let count = 0;
		let files = db.table('albumsFiles')
			.where({ albumId: link.albumId })
			.join('files', 'albumsFiles.fileId', 'files.id')
			.select('files.name', 'files.id')
			.orderBy('files.id', 'desc');

		const { page, limit = 50 } = req.query;
		if (page && page >= 0) {
			files = await files.offset((page - 1) * limit).limit(limit);

			const dbRes = await db.table('albumsFiles')
				.where({ albumId: link.albumId })
				.join('files', 'albumsFiles.fileId', 'files.id')
				.select('files.name', 'files.id')
				.orderBy('files.id', 'desc')
				.count('* as count')
				.first();

			count = dbRes.count;
		} else {
			files = await files; // execute the query
			count = files.length;
		}

		for (let file of files) {
			file = Util.constructFilePublicLink(req, file);
		}

		// Add 1 more view to the link
		await db.table('links').where({ identifier }).update('views', Number(link.views) + 1);

		return res.json({
			message: 'Successfully retrieved files',
			name: album.name,
			downloadEnabled: link.enableDownload,
			isNsfw: album.nsfw,
			files,
			count
		});
	}
}

module.exports = albumGET;
