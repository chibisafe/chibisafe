const Joi = require('joi');

const Route = require('../../structures/Route');
const Util = require('../../utils/Util');

const { schema } = require('../../structures/Setting');

class configGET extends Route {
	constructor() {
		super('/service/config', 'post', { adminOnly: true });
	}

	run(req, res) {
		const { settings } = req.body;
		const validationRes = schema.validate(settings, { abortEarly: false });
		console.log(JSON.stringify(validationRes));
	}
}

module.exports = configGET;
