const moment = require('moment');
const Route = require('../../structures/Route');

class albumPOST extends Route {
	constructor() {
		super('/album/new', 'post', { canApiKey: true });
	}

	async run(req, res, db, user) {
		if (!req.body) return res.status(400).json({ message: 'No body provided' });
		const { name } = req.body;
		if (!name) return res.status(400).json({ message: 'No name provided' });

		/*
			Check that an album with that name doesn't exist yet
		*/
		const album = await db
			.table('albums')
			.where({ name, userId: user.id })
			.first();
		if (album) return res.status(401).json({ message: "There's already an album with that name" });

		const now = moment.utc().toDate();
		const insertObj = {
			name,
			userId: user.id,
			createdAt: now,
			editedAt: now
		};

		const dbRes = await db
			.table('albums')
			.insert(insertObj)
			.returning('id')
			.wasMutated();

		insertObj.id = dbRes.pop();

		return res.json({ message: 'The album was created successfully', data: insertObj });
	}
}

module.exports = albumPOST;
