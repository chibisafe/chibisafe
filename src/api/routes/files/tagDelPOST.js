const Route = require('../../structures/Route');

class albumDelPOST extends Route {
	constructor() {
		super('/file/album/del', 'post');
	}

	async run(req, res, db) {
		if (!req.body) return res.status(400).json({ message: 'No body provided' });
		const { fileId, albumId } = req.body;
		if (!fileId || !albumId) return res.status(400).json({ message: 'No id provided' });

		try {
			await db.table('albumsFiles')
				.where({ fileId, albumId })
				.delete();
		} catch (error) {
			return super.error(res, error);
		}

		return res.json({
			message: 'Successfully removed file from album'
		});
	}
}

module.exports = albumDelPOST;
