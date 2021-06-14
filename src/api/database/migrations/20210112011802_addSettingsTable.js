exports.up = async knex => {
	await knex.schema.createTable('settings', table => {
		table.string('key');
		table.string('value');
	});
};

exports.down = async knex => {
	await knex.schema.dropTableIfExists('settings');
};
