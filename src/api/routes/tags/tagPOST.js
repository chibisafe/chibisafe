const Route = require('../../structures/Route');
const moment = require('moment');

class tagPOST extends Route {
	constructor() {
		super('/tag/new', 'post');
	}

	async run(req, res, db, user) {
		if (!req.body) return res.status(400).json({ message: 'No body provided' });
		const { name } = req.body;
		if (!name) return res.status(400).json({ message: 'No name provided' });

		/*
			Check that a tag with that name doesn't exist yet
		*/
		const tag = await db.table('tags').where({ name, userId: user.id }).first();
		if (tag) return res.status(401).json({ message: 'There\'s already a tag with that name' });

		const now = moment.utc().toDate();
		await db.table('tags').insert({
			name,
			userId: user.id,
			createdAt: now,
			editedAt: now
		});

		return res.json({ message: 'The tag was created successfully' });
	}
}

module.exports = tagPOST;
