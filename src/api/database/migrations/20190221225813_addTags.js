exports.up = async knex => {
	await knex.schema.createTable('tags', table => {
		table.increments();
		table.string('uuid');
		table.integer('userId');
		table.string('name');
		table.timestamp('createdAt');
		table.timestamp('editedAt');
	});

	await knex.schema.createTable('fileTags', table => {
		table.increments();
		table.integer('fileId');
		table.integer('tagId');
	});
};

exports.down = async knex => {
	await knex.schema.dropTableIfExists('tags');
	await knex.schema.dropTableIfExists('fileTags');
};
