const Route = require('../../structures/Route');

class usersGET extends Route {
	constructor() {
		super('/users/me', 'get');
	}

	run(req, res, db, user) {
		return res.json({
			message: 'Successfully retrieved user',
			user: {
				id: user.id,
				username: user.username,
				isAdmin: user.isAdmin
			}
		});
	}
}

module.exports = usersGET;
