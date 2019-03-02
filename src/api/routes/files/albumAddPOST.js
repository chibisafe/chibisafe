const Route = require('../../structures/Route');

class albumAddPOST extends Route {
	constructor() {
		super('/file/album/add', 'post');
	}

	async run(req, res, db) {
		if (!req.body) return res.status(400).json({ message: 'No body provided' });
		const { fileId, albumId } = req.body;
		if (!fileId || !albumId) return res.status(400).json({ message: 'No id provided' });

		try {
			await db.table('albumsFiles')
				.insert({ fileId, albumId });
		} catch (error) {
			return super.error(res, error);
		}

		return res.json({
			message: 'Successfully added file to album'
		});
	}
}

module.exports = albumAddPOST;
