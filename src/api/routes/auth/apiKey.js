const Route = require('../../structures/Route');

class apiKeyGET extends Route {
	constructor() {
		super('/auth/apiKey', 'get');
	}

	run(req, res, user) {
		return res.json({ message: 'Hai hai api works.' });
	}
}

class apiKeyPOST extends Route {
	constructor() {
		super('/auth/apiKey', 'post');
	}

	run(req, res, user) {
		return res.json({ message: 'Hai hai api works.' });
	}
}

module.exports = [apiKeyGET, apiKeyPOST];
