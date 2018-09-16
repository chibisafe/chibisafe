const Route = require('../../../structures/Route');
const config = require('../../../../../config');
const db = require('knex')(config.server.database);
const Util = require('../../../utils/Util');
const log = require('../../../utils/Log');

class linkPOST extends Route {
	constructor() {
		super('/album/link/new', 'post');
	}

	async run(req, res) {
		if (!req.body) return res.status(400).json({ message: 'No body provided' });
		const { albumId } = req.body;
		if (!albumId) return res.status(400).json({ message: 'No album provided' });

		const exists = await db.table('albums').where('id', albumId).first();
		if (!exists) return res.status(400).json({ message: 'Album doesn\t exist' });

		const identifier = await Util.getUniqueAlbumIdentifier();
		if (!identifier) return res.status(500).json({ message: 'There was a problem allocating a link for your album' });

		try {
			await db.table('links').insert({
				identifier,
				albumId,
				enabled: true,
				enableDownload: true,
				expiresAt: null
			});

			return res.json({
				message: 'The link was created successfully',
				identifier
			});
		} catch (error) {
			log.error(error);
			return res.status(500).json({ message: 'There was a problem creating the link' });
		}
	}
}

module.exports = linkPOST;
