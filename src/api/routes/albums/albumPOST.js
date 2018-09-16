const Route = require('../../structures/Route');
const config = require('../../../../config');
const db = require('knex')(config.server.database);
const moment = require('moment');

class albumPOST extends Route {
	constructor() {
		super('/album/new', 'post');
	}

	async run(req, res, user) {
		if (!req.body) return res.status(400).json({ message: 'No body provided' });
		const { name } = req.body;
		if (!name) return res.status(400).json({ message: 'No name provided' });

		const album = await db.table('albums').where({
			name,
			enabled: true,
			userId: user.id
		}).first();

		if (album) return res.status(401).json({ message: 'There\'s already an album with that name' });

		const now = moment.utc().toDate();
		/*
		const identifier = await Util.getUniqueAlbumIdentifier();
		if (!identifier) {
			console.error('Couldn\'t allocate an identifier for an album');
			return res.status(500).json({ message: 'There was a problem allocating an identifier to the album' });
		}
		*/
		await db.table('albums').insert({
			name,
			enabled: true,
			userId: user.id,
			createdAt: now,
			editedAt: now
		});

		return res.json({ message: 'The album was created successfully' });
	}
}

module.exports = albumPOST;
