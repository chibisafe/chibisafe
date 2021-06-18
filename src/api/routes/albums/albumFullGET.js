const Route = require('../../structures/Route');
const Util = require('../../utils/Util');

class albumGET extends Route {
	constructor() {
		super('/album/:id/full', 'get');
	}

	async run(req, res, db, user) {
		const { id } = req.params;
		if (!id) return res.status(400).json({ message: 'Invalid id supplied' });

		const album = await db
			.table('albums')
			.where({ id, userId: user.id })
			.first();
		if (!album) return res.status(404).json({ message: 'Album not found' });

		let count = 0;

		let files = db
			.table('albumsFiles')
			.where({ albumId: id })
			.join('files', 'albumsFiles.fileId', 'files.id')
			.select('files.id', 'files.name', 'files.createdAt')
			.orderBy('files.id', 'desc');

		const { page, limit = 100 } = req.query;
		if (page && page >= 0) {
			files = await files.offset((page - 1) * limit).limit(limit);

			const dbRes = await db
				.table('albumsFiles')
				.count('* as count')
				.where({ albumId: id })
				.first();

			count = dbRes.count;
		} else {
			files = await files; // execute the query
			count = files.length;
		}

		// eslint-disable-next-line no-restricted-syntax
		for (let file of files) {
			file = Util.constructFilePublicLink(req, file);
		}

		return res.json({
			message: 'Successfully retrieved album',
			name: album.name,
			files,
			count
		});
	}
}

module.exports = albumGET;
