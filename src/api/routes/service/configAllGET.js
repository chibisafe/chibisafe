const Route = require('../../structures/Route');
const Util = require('../../utils/Util');

class configGET extends Route {
	constructor() {
		super('/service/config/all', 'get', { adminOnly: true });
	}

	run(req, res) {
		return res.json({
			message: 'Successfully retrieved config',
			config: Util.config
		});
	}
}

module.exports = configGET;
