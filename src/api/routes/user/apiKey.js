const Route = require('../../structures/Route');
const randomstring = require('randomstring');
const moment = require('moment');
const { dump } = require('dumper.js');

class apiKeyPOST extends Route {
	constructor() {
		super('/user/apikey/change', 'post');
	}

	async run(req, res, db, user) {
		const now = moment.utc().toDate();
		const apiKey = randomstring.generate(64);

		try {
			await db.table('users')
				.where({ id: user.id })
				.update({
					apiKey,
					apiKeyEditedAt: now
				});
		} catch (error) {
			dump(error);
			return res.status(401).json({ message: 'There was a problem processing your account' });
		}

		return res.json({
			message: 'Successfully created new api key',
			apiKey
		});
	}
}

module.exports = apiKeyPOST;
