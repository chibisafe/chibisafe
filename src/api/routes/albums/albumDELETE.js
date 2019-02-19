const Route = require('../../structures/Route');
const Util = require('../../utils/Util');
const log = require('../../utils/Log');

class albumDELETE extends Route {
	constructor() {
		super('/album/:id/:purge*?', 'delete');
	}

	async run(req, res, db, user) {
		const { id, purge } = req.params;
		if (!id) return res.status(400).json({ message: 'Invalid album ID supplied' });

		/*
			Check fi the album exists
		*/
		const album = await db.table('albums').where({ id, userId: user.id }).first();
		if (!album) return res.status(400).json({ message: 'The file doesn\'t exist or doesn\'t belong to the user' });

		try {
			/*
				Should we also delete every file of that album?
			*/
			if (purge) {
				await Util.deleteAllFilesFromAlbum(id);
			}
			/*
				Delete the album
			*/
			await db.table('albums').where({ id }).delete();
			return res.json({ message: 'The album was deleted successfully' });
		} catch (error) {
			log.error(error);
			return res.json({ message: 'There was a problem deleting the album' });
		}
	}
}

module.exports = albumDELETE;
