const Route = require('../../structures/Route');

class restartPOST extends Route {
	constructor() {
		super('/service/restart', 'post', { adminOnly: true });
	}

	run(req, res) {
		res.json({ message: 'Restarting...' });
		process.exit(0);
	}
}

module.exports = restartPOST;
