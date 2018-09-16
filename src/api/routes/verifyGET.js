const Route = require('../structures/Route');

class verifyGET extends Route {
	constructor() {
		super('/verify', 'get');
	}

	run(req, res, user) {
		return res.json({
			message: 'Successfully verified token',
			user
		});
	}
}

module.exports = verifyGET;
