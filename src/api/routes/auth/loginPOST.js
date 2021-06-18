const bcrypt = require('bcrypt');
const moment = require('moment');
const JWT = require('jsonwebtoken');
const Route = require('../../structures/Route');
const Util = require('../../utils/Util');

class loginPOST extends Route {
	constructor() {
		super('/auth/login', 'post', { bypassAuth: true });
	}

	async run(req, res, db) {
		if (!req.body) return res.status(400).json({ message: 'No body provided' });
		const { username, password } = req.body;
		if (!username || !password) return res.status(401).json({ message: 'Invalid body provided' });

		/*
			Checks if the user exists
		*/
		const user = await db.table('users').where('username', username).first();
		if (!user) return res.status(401).json({ message: 'Invalid authorization' });

		/*
			Checks if the user is disabled
		*/
		if (!user.enabled) return res.status(401).json({ message: 'This account has been disabled' });

		/*
			Checks if the password is right
		*/
		const comparePassword = await bcrypt.compare(password, user.password);
		if (!comparePassword) return res.status(401).json({ message: 'Invalid authorization.' });

		/*
			Create the jwt with some data
		*/
		const jwt = JWT.sign({
			iss: 'chibisafe',
			sub: user.id,
			iat: moment.utc().valueOf()
		}, Util.config.secret, { expiresIn: '30d' });

		return res.json({
			message: 'Successfully logged in.',
			user: {
				id:	user.id,
				username: user.username,
				apiKey: user.apiKey,
				isAdmin: user.isAdmin
			},
			token: jwt,
			apiKey: user.apiKey
		});
	}
}

module.exports = loginPOST;
