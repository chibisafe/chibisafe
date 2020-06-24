const Route = require('../../structures/Route');
const Util = require('../../utils/Util');

class albumGET extends Route {
	constructor() {
		super('/album/:id/full', 'get');
	}

	async run(req, res, db, user) {
		const { id } = req.params;
		if (!id) return res.status(400).json({ message: 'Invalid id supplied' });

		const album = await db.table('albums').where({ id, userId: user.id }).first();
		if (!album) return res.status(404).json({ message: 'Album not found' });

		const files = await db.table('albumsFiles')
			.where({ albumId: id })
			.join('files', 'albumsFiles.fileId', 'files.id')
			.select('files.id', 'files.name')
			.orderBy('files.id', 'desc');

		for (let file of files) {
			file = Util.constructFilePublicLink(file);
		}

		return res.json({
			message: 'Successfully retrieved album',
			name: album.name,
			files
		});
	}
}

module.exports = albumGET;
