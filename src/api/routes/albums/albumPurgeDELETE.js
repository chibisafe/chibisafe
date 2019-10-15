const Route = require('../../structures/Route');
const Util = require('../../utils/Util');

class albumDELETE extends Route {
	constructor() {
		super('/album/:id/purge', 'delete');
	}

	async run(req, res, db, user) {
		const { id } = req.params;
		if (!id) return res.status(400).json({ message: 'Invalid album ID supplied' });

		/*
			Check if the album exists
		*/
		const album = await db.table('albums').where({ id, userId: user.id }).first();
		if (!album) return res.status(400).json({ message: 'The album doesn\'t exist or doesn\'t belong to the user' });

		try {
			await Util.deleteAllFilesFromAlbum(id);
			await db.table('albums').where({ id }).delete();
			return res.json({ message: 'The album was deleted successfully' });
		} catch (error) {
			return super.error(res, error);
		}
	}
}

module.exports = albumDELETE;
