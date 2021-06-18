const JWT = require('jsonwebtoken');
const db = require('./Database');
const moment = require('moment');
const log = require('../utils/Log');
const Util = require('../utils/Util');

class Route {
	constructor(path, method, options) {
		if (!path) throw new Error('Every route needs a URL associated with it.');
		if (!method) throw new Error('Every route needs its method specified.');

		this.path = path;
		this.method = method;
		this.options = options || {};
	}

	async authorize(req, res) {
		const banned = await db
			.table('bans')
			.where({ ip: req.ip })
			.first();
		if (banned) return res.status(401).json({ message: 'This IP has been banned from using the service.' });

		if (this.options.bypassAuth) return this.run(req, res, db);
		// The only reason I call it token here and not Api Key is to be backwards compatible
		// with the uploader and sharex
		// Small price to pay.
		if (req.headers.token) return this.authorizeApiKey(req, res, req.headers.token);
		if (!req.headers.authorization) return res.status(401).json({ message: 'No authorization header provided' });

		const token = req.headers.authorization.split(' ')[1];
		if (!token) return res.status(401).json({ message: 'No authorization header provided' });

		return JWT.verify(token, Util.config.secret, async (error, decoded) => {
			if (error) {
				log.error(error);
				return res.status(401).json({ message: 'Invalid token' });
			}
			const id = decoded ? decoded.sub : '';
			const iat = decoded ? decoded.iat : '';

			const user = await db
				.table('users')
				.where({ id })
				.first();
			if (!user) return res.status(401).json({ message: 'Invalid authorization' });
			if (iat && iat < moment(user.passwordEditedAt).format('x')) {
				return res.status(401).json({ message: 'Token expired' });
			}
			if (!user.enabled) return res.status(401).json({ message: 'This account has been disabled' });
			if (this.options.adminOnly && !user.isAdmin) { return res.status(401).json({ message: 'Invalid authorization' }); }

			return this.run(req, res, db, user);
		});
	}

	async authorizeApiKey(req, res, apiKey) {
		if (!this.options.canApiKey) return res.status(401).json({ message: 'Api Key not allowed for this resource' });
		const user = await db
			.table('users')
			.where({ apiKey })
			.first();
		if (!user) return res.status(401).json({ message: 'Invalid authorization' });
		if (!user.enabled) return res.status(401).json({ message: 'This account has been disabled' });

		return this.run(req, res, db, user);
	}

	run() {}

	error(res, error) {
		log.error(error);
		return res.status(500).json({ message: 'There was a problem parsing the request' });
	}
}

module.exports = Route;
