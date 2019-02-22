const bcrypt = require('bcrypt');
const moment = require('moment');
const randomstring = require('randomstring');

exports.seed = async db => {
	const now = moment.utc().toDate();
	const user = await db.table('users').where({ username: 'root' }).first();
	if (user) return;
	try {
		const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
		await db.table('users').insert({
			username: process.env.ADMIN_ACCOUNT,
			password: hash,
			apiKey: randomstring.generate(64),
			passwordEditedAt: now,
			apiKeyEditedAt: now,
			createdAt: now,
			editedAt: now,
			enabled: true,
			isAdmin: true
		});
		console.log();
		console.log('====================================================');
		console.log('==    Successfully created the admin account.     ==');
		console.log('====================================================');
		console.log('==      Run `yarn api` and `yarn site` next       ==');
		console.log('== preferably with pm2 or tmux to keep them alive ==');
		console.log('====================================================');
		console.log();
	} catch (error) {
		console.error(error);
	}
}
