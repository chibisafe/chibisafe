const bcrypt = require('bcrypt');
const moment = require('moment');

exports.seed = async db => {
	const now = moment.utc().toDate();
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
