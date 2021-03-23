exports.up = async knex => {
	await knex.schema.createTable('settings', table => {
		table.string('key').unique();
		table.json('value').notNullable();
	});
};

exports.down = async knex => {
	await knex.schema.dropTableIfExists('settings');
};
