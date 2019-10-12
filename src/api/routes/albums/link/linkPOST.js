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
		const exists = await db.table('albums').where({ id: albumId, userId: user.id }).first();
		if (!exists) return res.status(400).json({ message: 'Album doesn\t exist' });

		/*
			Count the amount of links created for that album already and error out if max was reached
		*/
		const count = await db.table('links').where('albumId', albumId).count({ count: 'id' });
		if (count[0].count >= parseInt(process.env.MAX_LINKS_PER_ALBUM, 10)) return res.status(400).json({ message: 'Maximum links per album reached' });

		/*
			Try to allocate a new identifier on the db
		*/
		const identifier = await Util.getUniqueAlbumIdentifier();
		if (!identifier) return res.status(500).json({ message: 'There was a problem allocating a link for your album' });

		try {
			await db.table('links').insert({
				identifier,
				userId: user.id,
				albumId,
				enabled: true,
				enableDownload: true,
				expiresAt: null,
				views: 0
			});

			return res.json({
				message: 'The link was created successfully',
				identifier
			});
		} catch (error) {
			return super.error(res, error);
		}
	}
}

module.exports = linkPOST;
