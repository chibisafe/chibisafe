const Route = require('../../structures/Route');

class userDisable extends Route {
	constructor() {
		super('/admin/users/disable', 'post', { adminOnly: true });
	}

	async run(req, res, db, user) {
		if (!req.body) return res.status(400).json({ message: 'No body provided' });
		const { id } = req.body;
		if (!id) return res.status(400).json({ message: 'No id provided' });
		if (id === user.id) return res.status(400).json({ message: 'You can\'t apply this action to yourself' });

		try {
			await db.table('users')
				.where({ id })
				.update({ enabled: false });
		} catch (error) {
			return super.error(res, error);
		}

		return res.json({
			message: 'Successfully disabled user'
		});
	}
}

module.exports = userDisable;
