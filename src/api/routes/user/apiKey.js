const Route = require('../../structures/Route');
const randomstring = require('randomstring');
const moment = require('moment');
const bcrypt = require('bcrypt');
const { dump } = require('dumper.js');

class apiKeyPOST extends Route {
	constructor() {
		super('/user/apikey/change', 'post', { noApiKey: true });
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
