const Route = require('../../structures/Route');
const randomstring = require('randomstring');
const moment = require('moment');
const bcrypt = require('bcrypt');

class apiKeyPOST extends Route {
	constructor() {
		super('/user/apikey/change', 'post');
	}

	async run(req, res, db, user) {
		const now = moment.utc().toDate();
		const apiKey = randomstring.generate(64);

		try {
			const hash = await bcrypt.hash(apiKey, 10);

			await db.table('users')
				.where({ id: user.id })
				.update({
					apiKey: hash,
					apiKeyEditedAt: now
				});

			return res.json({
				message: 'Successfully created new api key',
				apiKey
			});

		} catch (error) {
			return super.error(res, error);
		}


	}
}

module.exports = apiKeyPOST;
