const Route = require('../../../structures/Route');
const config = require('../../../../../config');
const db = require('knex')(config.server.database);
const log = require('../../../utils/Log');

class linkEnabledPOST extends Route {
	constructor() {
		super('/album/link/enabled', 'post');
	}

	async run(req, res, user) {
		if (!req.body) return res.status(400).json({ message: 'No body provided' });
		const { identifier, enabled } = req.body;
		if (!identifier) return res.status(400).json({ message: 'Invalid album identifier supplied' });

		const link = await db.table('links').where({
			identifier,
			userId: user.id
		}).first();

		if (!link) return res.status(400).json({ message: 'The link doesn\'t exist or doesn\'t belong to the user' });
		try {
			await db.table('links')
				.where({ identifier })
				.update({ enabled });
			return res.json({ message: 'The link status was changed successfully' });
		} catch (error) {
			log.error(error);
			return res.json({ message: 'There was a problem changing the status of the link' });
		}
	}
}

module.exports = linkEnabledPOST;
