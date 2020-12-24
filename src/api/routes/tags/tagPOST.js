const moment = require('moment');
const Route = require('../../structures/Route');

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
		const insertObj = {
			name,
			userId: user.id,
			createdAt: now,
			editedAt: now
		};

		const dbRes = await db.table('tags').insert(insertObj);

		insertObj.id = dbRes.pop();

		return res.json({ message: 'The tag was created successfully', data: insertObj });
	}
}

module.exports = tagPOST;
