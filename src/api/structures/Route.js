const nodePath = require('path');
const JWT = require('jsonwebtoken');
const db = require('knex')({
	client: process.env.DB_CLIENT,
	connection: {
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
		filename: nodePath.join(__dirname, '..', '..', '..', 'database.sqlite')
	},
	postProcessResponse: result => {
		/*
			Fun fact: Depending on the database used by the user and given that I don't want
			to force a specific database for everyone because of the nature of this project,
			some things like different data types for booleans need to be considered like in
			the implementation below where sqlite returns 1 and 0 instead of true and false.
		*/
		const booleanFields = [
			'enabled',
			'enableDownload',
			'isAdmin'
		];

		const processResponse = row => {
			Object.keys(row).forEach(key => {
				if (booleanFields.includes(key)) {
					if (row[key] === 0) row[key] = false;
					else if (row[key] === 1) row[key] = true;
				}
			});
			return row;
		};

		if (Array.isArray(result)) return result.map(row => processResponse(row));
		if (typeof result === 'object') return processResponse(result);
		return result;
	},
	useNullAsDefault: process.env.DB_CLIENT === 'sqlite3' ? true : false
});
const moment = require('moment');
const log = require('../utils/Log');

class Route {
	constructor(path, method, options) {
		if (!path) throw new Error('Every route needs a URL associated with it.');
		if (!method) throw new Error('Every route needs its method specified.');

		this.path = path;
		this.method = method;
		this.options = options || {};
	}

	async authorize(req, res) {
		const banned = await db.table('bans').where({ ip: req.ip }).first();
		if (banned) return res.status(401).json({ message: 'This IP has been banned from using the service.' });

		if (this.options.bypassAuth) return this.run(req, res, db);
		// The only reason I call it token here and not Api Key is to be backwards compatible with the uploader and sharex
		// Small price to pay.
		if (req.headers.token) return this.authorizeApiKey(req, res, req.headers.token);
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

	async authorizeApiKey(req, res, apiKey) {
		if (!this.options.canApiKey) return res.status(401).json({ message: 'Api Key not allowed for this resource' });
		const user = await db.table('users').where({ apiKey }).first();
		if (!user) return res.status(401).json({ message: 'Invalid authorization' });
		if (!user.enabled) return res.status(401).json({ message: 'This account has been disabled' });

		return this.run(req, res, db, user);
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
