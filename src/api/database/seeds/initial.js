/* eslint-disable no-console */
const bcrypt = require('bcrypt');
const moment = require('moment');
const Util = require('../../utils/Util');

exports.seed = async db => {
	const now = moment.utc().toDate();

	// Save environment variables to the database
	try {
		const defaults = Util.getEnvironmentDefaults();
		const keys = Object.keys(defaults);
		for (const item of keys) {
			await Util.writeConfigToDb({
				key: item,
				value: defaults[item]
			});
		}
	} catch (error) {
		console.error(error);
	}

	// Create admin user if it doesnt exist
	const user = await db.table('users').where({ username: 'admin' }).first();
	if (user) {
		console.log();
		console.log('=========================================================');
		console.log('==       admin account already exists, skipping.       ==');
		console.log('=========================================================');
		console.log('==    Run `pm2 start pm2.json` to start the service    ==');
		console.log('=========================================================');
		console.log();
		return;
	}
	try {
		const hash = await bcrypt.hash('admin', 10);
		await db.table('users').insert({
			username: 'admin',
			password: hash,
			passwordEditedAt: now,
			createdAt: now,
			editedAt: now,
			enabled: true,
			isAdmin: true
		});
		console.log();
		console.log('=========================================================');
		console.log('==       Successfully created the admin account.       ==');
		console.log('=========================================================');
		console.log('==    Run `pm2 start pm2.json` to start the service    ==');
		console.log('=========================================================');
		console.log();
	} catch (error) {
		console.error(error);
	}
};
