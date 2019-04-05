const JWT = require('jsonwebtoken');
const db = require('knex')({
	client: process.env.DB_CLIENT,
	connection: {
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE
	}
});
const moment = require('moment');
const log = require('../utils/Log');
const bcrypt = require('bcrypt');

class Route {
	constructor(path, method, options) {
		if (!path) throw new Error('Every route needs a URL associated with it.');
		if (!method) throw new Error('Every route needs its method specified.');

		this.path = path;
		this.method = method;
		this.options = options || {};
	}

	authorize(req, res) {
		if (this.options.bypassAuth) return this.run(req, res, db);
		if (req.headers.apiKey) return this.authorizeApiKey(req, res, req.headers.apiKey);
		if (!req.headers.authorization) return res.status(401).json({ message: 'No authorization header provided' });

		const token = req.headers.authorization.split(' ')[1];
		if (!token) return res.status(401).json({ message: 'No authorization header provided' });

		return JWT.verify(token, process.env.SECRET, async (error, decoded) => {
			if (error) {
				log.error(error);
				return res.status(401).json({ message: 'Invalid token' });
			}
			const id = decoded ? decoded.sub : '';
			const iat = decoded ? decoded.iat : '';

			const user = await db.table('users').where({ id }).first();
			if (!user) return res.status(401).json({ message: 'Invalid authorization' });
			if (iat && iat < moment(user.passwordEditedAt).format('x')) return res.status(401).json({ message: 'Token expired' });
			if (!user.enabled) return res.status(401).json({ message: 'This account has been disabled' });
			if (this.options.adminOnly && !user.isAdmin) return res.status(401).json({ message: 'Invalid authorization' });

			return this.run(req, res, db, user);
		});
	}

	authorizeApiKey(req, res, apiKey) {
		if (this.options.noApiKey) return res.status(401).json({ message: 'Api Key not allowed for this resource' });

		/*
		Need to read more into how api keys work before proceeding any further

		const comparePassword = await bcrypt.compare(password, user.password);
		if (!comparePassword) return res.status(401).json({ message: 'Invalid authorization.' });
		*/
	}

	run(req, res, db) { // eslint-disable-line no-unused-vars
		return;
	}

	error(res, error) {
		log.error(error);
		return res.status(500).json({ message: 'There was a problem parsing the request' });
	}
}

module.exports = Route;
