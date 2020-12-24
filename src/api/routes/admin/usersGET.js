const Route = require('../../structures/Route');

class usersGET extends Route {
	constructor() {
		super('/admin/users', 'get', { adminOnly: true });
	}

	async run(req, res, db) {
		try {
			const users = await db.table('users')
				.select('id', 'username', 'enabled', 'isAdmin', 'createdAt');

			return res.json({
				message: 'Successfully retrieved users',
				users
			});
		} catch (error) {
			return super.error(res, error);
		}
	}
}

module.exports = usersGET;
