const Route = require('../../structures/Route');
const Util = require('../../utils/Util');

const { schema } = require('../../structures/Setting');

const joiOptions = {
	abortEarly: false, // include all errors
	allowUnknown: true, // ignore unknown props
	stripUnknown: true // remove unknown props
};

class configGET extends Route {
	constructor() {
		super('/service/config', 'post', { adminOnly: true });
	}

	async run(req, res) {
		const { settings } = req.body;
		const { error, value } = schema.validate(settings, joiOptions);
		if (error) {
			return res.status(400).json({
				errors: error.details.reduce((acc, v) => {
					for (const p of v.path) {
						acc[p] = (acc[p] || []).concat(v.message);
					}
					return acc;
				}, {})
			});
		}

		await Util.wipeConfigDb();

		const keys = Object.keys(value);
		for await (const item of keys) {
			Util.writeConfigToDb({
				key: item,
				value: value[item]
			});
		}

		return res.status(200).json({ value });
	}
}

module.exports = configGET;
