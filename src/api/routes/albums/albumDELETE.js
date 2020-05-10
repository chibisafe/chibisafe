const Route = require('../../structures/Route');
const Util = require('../../utils/Util');

class albumDELETE extends Route {
	constructor() {
		super('/album/:id', 'delete');
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
			// Delete the album
			await db.table('albums').where({ id }).delete();

			// Delete the relation of any files attached to this album
			await db.table('albumsFiles').where({ albumId: id }).delete();

			// Delete the relation of any links attached to this album
			await db.table('albumsLinks').where({ albumId: id }).delete();

			// Delete any album links created for this album
			await db.table('links').where({ albumId: id }).delete();

			return res.json({ message: 'The album was deleted successfully' });
		} catch (error) {
			return super.error(res, error);
		}
	}
}

module.exports = albumDELETE;
