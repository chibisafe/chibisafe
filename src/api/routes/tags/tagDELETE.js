const Route = require('../../structures/Route');
const Util = require('../../utils/Util');

class tagDELETE extends Route {
	constructor() {
		super('/tag/:id/:purge?', 'delete');
	}

	async run(req, res, db, user) {
		const { id, purge } = req.params;
		if (!id) return res.status(400).json({ message: 'Invalid tag supplied' });

		/*
			Check if the tag exists
		*/
		const tag = await db.table('tags').where({ id, userId: user.id }).first();
		if (!tag) return res.status(400).json({ message: 'The tag doesn\'t exist or doesn\'t belong to the user' });

		try {
			/*
				Should we also delete every file of that tag?
			*/
			if (purge) {
				await Util.deleteAllFilesFromTag(id);
			}
			/*
				Delete the tag
			*/
			await db.table('tags').where({ id }).delete()
				.wasMutated();
			return res.json({ message: 'The tag was deleted successfully', data: tag });
		} catch (error) {
			return super.error(res, error);
		}
	}
}

module.exports = tagDELETE;
