const Route = require('../../../structures/Route');
const log = require('../../../utils/Log');

class linkEditPOST extends Route {
	constructor() {
		super('/album/link/edit', 'post');
	}

	async run(req, res, db, user) {
		if (!req.body) return res.status(400).json({ message: 'No body provided' });
		const { identifier, enableDownload, expiresAt } = req.body;
		if (!identifier) return res.status(400).json({ message: 'Invalid album identifier supplied' });

		/*
			Make sure the link exists
		*/
		const link = await db.table('links').where({ identifier, userId: user.id }).first();
		if (!link) return res.status(400).json({ message: 'The link doesn\'t exist or doesn\'t belong to the user' });

		try {
			await db.table('links')
				.where({ identifier })
				.update({
					enableDownload: enableDownload || false,
					expiresAt // This one should be null if not supplied
				});
			return res.json({ message: 'Editing the link was successful' });
		} catch (error) {
			return super.error(res, error);
		}
	}
}

module.exports = linkEditPOST;
