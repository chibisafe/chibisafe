const Route = require('../structures/Route');

class verifyGET extends Route {
	constructor() {
		super('/', 'get', { bypassAuth: true });
	}

	run(req, res) {
		return res.json({ message: 'Hai hai api desu.' });
	}
}

module.exports = verifyGET;
