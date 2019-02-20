const config = require('../config.js');
const db = require('knex')(config.database);
const utils = require('./utilsController.js');

const usersController = {};

usersController.list = async (req, res, next) => {
	const user = await utils.authorize(req, res);

	if (!user.admin) return res.json({
		success: false,
		description: 'You are not an administrator'
	});

	let offset = req.query.page;
	if (offset===undefined) offset = 0;

	let users = await db.table('users')
		.orderBy('id', 'ASC')
		.limit(25)
		.offset(25 * offset)
		.select('id', 'username', 'admin', 'enabled');
	users = users.map(user => {
		return {
			id: user.id,
			username: user.username,
			admin: !!user.admin,
			enabled: user.enabled===0 ? false : true
			
		};
	});
	res.json({success: true, users});
};

usersController.enable = async (req, res, next) => {
	return usersController.setEnabled(req, res, true);
};
usersController.disable = async (req, res, next) => {
	return usersController.setEnabled(req, res, false);
};
usersController.setEnabled = async (req, res, mode) => {
	const user = await utils.authorize(req, res);
	
	if (!user.admin) return res.json({
		success: false,
		description: 'You are not an administrator'
	});

	const id=parseInt(req.params.id);
	if (user.id===id) return res.json({
		success: false,
		description: 'Cannot edit current user'
	});

	let updated = await db.table('users').where('id', id).update('enabled', mode ? 1 : 0);
	if (!updated) return res.json({
		success: false,
		description: 'User not found'
	});
	
	return res.json({
		success: true
	});
};

usersController.promote = async (req, res, next) => {
	return usersController.setAdmin(req, res, true);
};
usersController.demote = async (req, res, next) => {
	return usersController.setAdmin(req, res, false);
};
usersController.setAdmin = async (req, res, mode) => {
	const user = await utils.authorize(req, res);
	
	if (!user.admin) return res.json({
		success: false,
		description: 'You are not an administrator'
	});
	
	const id=parseInt(req.params.id);
	if (user.id===id) return res.json({
		success: false,
		description: 'Cannot edit current user'
	});

	let updated = await db.table('users').where('id', id).update('admin', mode ? 1 : 0);
	if (!updated) return res.json({
		success: false,
		description: 'User not found'
	});
	
	return res.json({
		success: true
	});
}

usersController.delete = async (req, res, next) => {
	const user = await utils.authorize(req, res);
	
	if (!user.admin) return res.json({
		success: false,
		description: 'You are not an administrator'
	});
	
	const id=parseInt(req.params.id);
	if (user.id===id) return res.json({
		success: false,
		description: 'Cannot delete current user'
	});
	
	let updated = await db.table('users').where('id', id).del();
	if (!updated) return res.json({
		success: false,
		description: 'User not found'
	});
	
	return res.json({
		success: true
	});
};

module.exports = usersController;
