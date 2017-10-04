const config = require('../config.js');
const db = require('knex')(config.database);
const randomstring = require('randomstring');
const utils = require('./utilsController.js');

const tokenController = {};

tokenController.verify = async (req, res, next) => {
	const token = req.body.token;
	if (token === undefined) return res.status(401).json({ success: false, description: 'No token provided' });

	const user = await db.table('users').where('token', token).first();
	if (!user) return res.status(401).json({ success: false, description: 'Invalid token' });
	return res.json({ success: true, username: user.username });
};

tokenController.list = async (req, res, next) => {
	const user = await utils.authorize(req, res);
	return res.json({ success: true, token: user.token });
};

tokenController.change = async (req, res, next) => {
	const user = await utils.authorize(req, res);
	const newtoken = randomstring.generate(64);

	await db.table('users').where('token', user.token).update({
		token: newtoken,
		timestamp: Math.floor(Date.now() / 1000)
	});

	res.json({ success: true, token: newtoken });
};

module.exports = tokenController;
