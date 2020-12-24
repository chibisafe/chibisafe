const Route = require('../structures/Route');

class verifyGET extends Route {
	constructor() {
		super('/verify', 'get');
	}

	run(req, res, db, user) {
		return res.json({
			message: 'Successfully verified token',
			user: {
				id:	user.id,
				username: user.username,
				isAdmin: user.isAdmin
			}
		});
	}
}

module.exports = verifyGET;
