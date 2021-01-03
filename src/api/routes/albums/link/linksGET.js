const Route = require('../../../structures/Route');

class linkPOST extends Route {
	constructor() {
		super('/album/:id/links', 'get');
	}

	async run(req, res, db, user) {
		const { id } = req.params;
		if (!id) return res.status(400).json({ message: 'Invalid id supplied' });

		const links = await db.table('links')
			.where({ albumId: id, userId: user.id });

		return res.json({
			message: 'Successfully retrieved links',
			links
		});
	}
}

module.exports = linkPOST;
