const Route = require('../../structures/Route');
const { configSchema } = require('../../structures/Setting');

class configGET extends Route {
	constructor() {
		super('/service/config/schema', 'get', { adminOnly: true });
	}

	run(req, res) {
		return res.json({
			message: 'Successfully retrieved schema',
			schema: configSchema
		});
	}
}

module.exports = configGET;
