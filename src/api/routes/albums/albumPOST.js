const Route = require('../../structures/Route');
const moment = require('moment');

class albumPOST extends Route {
	constructor() {
		super('/album/new', 'post');
	}

	async run(req, res, db, user) {
		if (!req.body) return res.status(400).json({ message: 'No body provided' });
		const { name } = req.body;
		if (!name) return res.status(400).json({ message: 'No name provided' });

		/*
			Check that an album with that name doesn't exist yet
		*/
		const album = await db.table('albums').where({ name, userId: user.id }).first();
		if (album) return res.status(401).json({ message: 'There\'s already an album with that name' });

		const now = moment.utc().toDate();
		await db.table('albums').insert({
			name,
			userId: user.id,
			createdAt: now,
			editedAt: now
		});

		return res.json({ message: 'The album was created successfully' });
	}
}

module.exports = albumPOST;
