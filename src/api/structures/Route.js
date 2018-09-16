const JWT = require('jsonwebtoken');
const { server } = require('../../../config');
const db = require('knex')(server.database);
const moment = require('moment');

class Route {
	constructor(path, method, options) {
		if (!path) throw new Error('Every route needs a URL associated with it.');
		if (!method) throw new Error('Every route needs its method specified.');

		this.path = path;
		this.method = method;
		this.options = options || {};
	}

	authorize(req, res) {
		if (this.options.bypassAuth) return this.run(req, res);
		if (!req.headers.authorization) return res.status(401).json({ message: 'No authorization header provided' });
		const token = req.headers.authorization.split(' ')[1];
		if (!token) return res.status(401).json({ message: 'No authorization header provided' });

		return JWT.verify(token, server.secret, async (error, decoded) => {
			if (error) {
				console.log(error);
				return res.status(401).json({ message: 'Your token appears to be invalid' });
			}
			const id = decoded ? decoded.sub : '';
			const iat = decoded ? decoded.iat : '';

			const user = await db.table('users').where({ id }).first();
			if (!user) return res.status(401).json({ message: 'Invalid authorization' });
			if (iat && iat < moment(user.passwordEditedAt).format('x')) return res.status(401).json({ message: 'Token expired' });
			if (!user.enabled) return res.status(401).json({ message: 'This account has been disabled' });

			return this.run(req, res, user);
		});
	}

	run(req, res, user) { // eslint-disable-line no-unused-vars
		return;
	}
}

module.exports = Route;
