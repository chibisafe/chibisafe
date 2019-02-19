const Route = require('../structures/Route');

class verifyGET extends Route {
	constructor() {
		super('/verify', 'get');
	}

	run(req, res, db, user) {
		const returnUser = {
			id:	user.id,
			username: user.username,
			apiKey: user.apiKey,
			isAdmin: user.isAdmin
		};

		return res.json({
			message: 'Successfully verified token',
			user: returnUser
		});
	}
}

module.exports = verifyGET;
