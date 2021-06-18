const bcrypt = require('bcrypt');
const moment = require('moment');
const Route = require('../../structures/Route');
const log = require('../../utils/Log');
const Util = require('../../utils/Util');

class registerPOST extends Route {
	constructor() {
		super('/auth/register', 'post', { bypassAuth: true });
	}

	async run(req, res, db) {
		// Only allow admins to create new accounts if the sign up is deactivated
		const user = await Util.isAuthorized(req);
		if ((!user || !user.isAdmin) && !Util.config.userAccounts) return res.status(401).json({ message: 'Creation of new accounts is currently disabled' });

		if (!req.body) return res.status(400).json({ message: 'No body provided' });
		const { username, password } = req.body;
		if (!username || !password) return res.status(401).json({ message: 'Invalid body provided' });

		if (username.length < 4 || username.length > 32) {
			return res.status(400).json({ message: 'Username must have 4-32 characters' });
		}
		if (password.length < 6 || password.length > 64) {
			return res.status(400).json({ message: 'Password must have 6-64 characters' });
		}

		/*
			Make sure the username doesn't exist yet
		*/
		const exists = await db.table('users').where('username', username).first();
		if (exists) return res.status(401).json({ message: 'Username already exists' });

		/*
			Hash the supplied password
		*/
		let hash;
		try {
			hash = await bcrypt.hash(password, 10);
		} catch (error) {
			log.error('Error generating password hash');
			log.error(error);
			return res.status(401).json({ message: 'There was a problem processing your account' });
		}

		/*
			Create the user
		*/
		const now = moment.utc().toDate();
		await db.table('users').insert({
			username,
			password: hash,
			passwordEditedAt: now,
			createdAt: now,
			editedAt: now,
			enabled: true,
			isAdmin: false
		}).wasMutated();
		return res.json({ message: 'The account was created successfully' });
	}
}

module.exports = registerPOST;
