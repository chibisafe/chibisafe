
exports.up = async knex => {
	await knex.schema.createTable('statistics', table => {
		table.increments();
		table.integer('batchId');
		table.string('type');
		table.json('data');
		table.timestamp('createdAt');

		table.unique(['batchId', 'type']);
	});
};

exports.down = async knex => {
	await knex.schema.dropTableIfExists('statistics');
};
