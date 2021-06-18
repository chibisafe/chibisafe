const Route = require('../../../structures/Route');
const Util = require('../../../utils/Util');

class linkPOST extends Route {
	constructor() {
		super('/album/link/new', 'post');
	}

	async run(req, res, db, user) {
		if (!req.body) return res.status(400).json({ message: 'No body provided' });
		const { albumId } = req.body;
		if (!albumId) return res.status(400).json({ message: 'No album provided' });

		/*
			Make sure the album exists
		*/
		const exists = await db
			.table('albums')
			.where({ id: albumId, userId: user.id })
			.first();
		if (!exists) return res.status(400).json({ message: 'Album doesn\t exist' });

		let { identifier } = req.body;
		if (identifier) {
			if (!user.isAdmin) return res.status(401).json({ message: 'Only administrators can create custom links' });

			if (!(/^[a-zA-Z0-9-_]+$/.test(identifier))) return res.status(400).json({ message: 'Only alphanumeric, dashes, and underscore characters are allowed' });

			/*
				Make sure that the id doesn't already exists in the database
			*/
			const idExists = await db
				.table('links')
				.where({ identifier })
				.first();

			if (idExists) return res.status(400).json({ message: 'Album with this identifier already exists' });
		} else {
			/*
				Try to allocate a new identifier in the database
			*/
			identifier = await Util.getUniqueAlbumIdentifier();
			if (!identifier) return res.status(500).json({ message: 'There was a problem allocating a link for your album' });
		}

		try {
			const insertObj = {
				identifier,
				userId: user.id,
				albumId,
				enabled: true,
				enableDownload: true,
				expiresAt: null,
				views: 0
			};
			await db.table('links').insert(insertObj).wasMutated();

			return res.json({
				message: 'The link was created successfully',
				data: insertObj
			});
		} catch (error) {
			return super.error(res, error);
		}
	}
}

module.exports = linkPOST;
