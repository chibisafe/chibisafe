const Route = require('../../structures/Route');
const config = require('../../../../config');
const log = require('../../utils/Log');
const db = require('knex')(config.server.database);
const bcrypt = require('bcrypt');
const randomstring = require('randomstring');
const moment = require('moment');

class registerPOST extends Route {
	constructor() {
		super('/auth/register', 'post', { bypassAuth: true });
	}

	async run(req, res) {
		if (!config.enableCreateUserAccounts) return res.status(401).json({ message: 'Creation of new accounts is currently disabled' });
		if (!req.body) return res.status(400).json({ message: 'No body provided' });
		const { username, password } = req.body;
		if (!username || !password) return res.status(401).json({ message: 'Invalid body provided' });

		if (username.length < 4 || username.length > 32) {
			return res.status(400).json({ message: 'Username must have 4-32 characters' });
		}
		if (password.length < 6 || password.length > 64) {
			return res.status(400).json({ message: 'Password must have 6-64 characters' });
		}

		const user = await db.table('users').where('username', username).first();
		if (user) return res.status(401).json({ message: 'Username already exists' });

		let hash;
		try {
			hash = await bcrypt.hash(password, 10);
		} catch (error) {
			log.error('Error generating password hash');
			log.error(error);
			return res.status(401).json({ message: 'There was a problem processing your account' });
		}

		const now = moment.utc().toDate();
		await db.table('users').insert({
			username,
			password: hash,
			passwordEditedAt: now,
			apiKey: randomstring.generate(64),
			apiKeyEditedAt: now,
			createdAt: now,
			editedAt: now
		});
		return res.json({ message: 'The account was created successfully' });
	}
}

module.exports = registerPOST;
