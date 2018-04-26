const config = require('../config.js');
const db = require('knex')(config.database);

const migration = {};
migration.start = async () => {
	await db.schema.table('albums', table => {
		table.integer('editedAt');
		table.integer('zipGeneratedAt');
	});
	console.log('Migration finished! Now start lolisafe normally');
};

migration.start();
