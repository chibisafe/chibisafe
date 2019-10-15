const Route = require('../../structures/Route');

class albumDelPOST extends Route {
	constructor() {
		super('/file/album/del', 'post');
	}

	async run(req, res, db, user) {
		if (!req.body) return res.status(400).json({ message: 'No body provided' });
		const { fileId, albumId } = req.body;
		if (!fileId || !albumId) return res.status(400).json({ message: 'No id provided' });

		// Make sure both file and album belong to the user
		const file = await db.table('files').where({ id: fileId, userId: user.id }).first();
		if (!file) return res.status(400).json({ message: 'File doesn\'t exist.' });
		const album = await db.table('albums').where({ id: albumId, userId: user.id }).first();
		if (!album) return res.status(400).json({ message: 'Album doesn\'t exist.' });

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
