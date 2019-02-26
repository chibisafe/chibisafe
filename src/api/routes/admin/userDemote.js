const Route = require('../../structures/Route');

class userDemote extends Route {
	constructor() {
		super('/admin/users/demote', 'get', { adminOnly: true });
	}

	async run(req, res, db) {
		if (!req.body) return res.status(400).json({ message: 'No body provided' });
		const { id } = req.body;
		if (!id) return res.status(400).json({ message: 'No name provided' });

		try {
			await db.table('users')
				.where({ id })
				.update({ isAdmin: false });
		} catch (error) {
			return super.error(res, error);
		}

		return res.json({
			message: 'Successfully promoted user'
		});
	}
}

module.exports = userDemote;
