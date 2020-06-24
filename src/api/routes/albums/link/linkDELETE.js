const Route = require('../../../structures/Route');
const { dump } = require('dumper.js');

class linkDELETE extends Route {
	constructor() {
		super('/album/link/delete/:identifier', 'delete');
	}

	async run(req, res, db, user) {
		const { identifier } = req.params;
		if (!identifier) return res.status(400).json({ message: 'Invalid identifier supplied' });

		try {
			const link = await db.table('links')
				.where({ identifier, userId: user.id })
				.first();

			if (!link) return res.status(400).json({ message: 'Identifier doesn\'t exist or doesnt\'t belong to the user' });

			await db.table('links')
				.where({ id: link.id })
				.delete();
			await db.table('albumsLinks')
				.where({ linkId: link.id })
				.delete();
		} catch (error) {
			return super.error(res, error);
		}

		return res.json({
			message: 'Successfully deleted link'
		});
	}
}

module.exports = linkDELETE;
