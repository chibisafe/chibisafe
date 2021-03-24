/* eslint-disable no-console */
const bcrypt = require('bcrypt');
const moment = require('moment');
const Util = require('../../utils/Util');

exports.seed = async db => {
	const now = moment.utc().toDate();

	// Save environment variables to the database
	try {
		const settings = await db.table('settings').first();
		if (!settings) {
			await Util.writeConfigToDb(Util.getEnvironmentDefaults(), false);
		}
	} catch (error) {
		console.error(error);
	}

	// Create admin user if it doesnt exist
	const user = await db.table('users').where({ username: process.env.ADMIN_ACCOUNT }).first();
	if (user) return;
	try {
		const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
		await db.table('users').insert({
			username: process.env.ADMIN_ACCOUNT,
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
