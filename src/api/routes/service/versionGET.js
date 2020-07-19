const Route = require('../../structures/Route');

class versionGET extends Route {
	constructor() {
		super('/version', 'get', { bypassAuth: true });
	}

	run(req, res) {
		return res.json({
			version: process.env.npm_package_version
		});
	}
}

module.exports = versionGET;
