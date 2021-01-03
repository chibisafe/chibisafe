exports.up = async knex => {
	await knex.schema.createTable('users', table => {
		table.increments();
		table.string('username');
		table.text('password');
		table.boolean('enabled');
		table.boolean('isAdmin');
		table.string('apiKey');
		table.timestamp('passwordEditedAt');
		table.timestamp('apiKeyEditedAt');
		table.timestamp('createdAt');
		table.timestamp('editedAt');
	});

	await knex.schema.createTable('albums', table => {
		table.increments();
		table.integer('userId');
		table.string('name');
		table.timestamp('zippedAt');
		table.timestamp('createdAt');
		table.timestamp('editedAt');
	});

	await knex.schema.createTable('files', table => {
		table.increments();
		table.integer('userId');
		table.string('name');
		table.string('original');
		table.string('type');
		table.integer('size');
		table.string('hash');
		table.string('ip');
		table.timestamp('createdAt');
		table.timestamp('editedAt');
	});

	await knex.schema.createTable('links', table => {
		table.increments();
		table.integer('userId');
		table.integer('albumId');
		table.string('identifier');
		table.integer('views');
		table.boolean('enabled');
		table.boolean('enableDownload');
		table.timestamp('expiresAt');
		table.timestamp('createdAt');
		table.timestamp('editedAt');
	});

	await knex.schema.createTable('albumsFiles', table => {
		table.increments();
		table.integer('albumId');
		table.integer('fileId');
	});

	await knex.schema.createTable('albumsLinks', table => {
		table.increments();
		table.integer('albumId');
		table.integer('linkId');
	});

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

	await knex.schema.createTable('bans', table => {
		table.increments();
		table.string('ip');
		table.timestamp('createdAt');
	});
};
exports.down = async knex => {
	await knex.schema.dropTableIfExists('users');
	await knex.schema.dropTableIfExists('albums');
	await knex.schema.dropTableIfExists('files');
	await knex.schema.dropTableIfExists('links');
	await knex.schema.dropTableIfExists('albumsFiles');
	await knex.schema.dropTableIfExists('albumsLinks');
	await knex.schema.dropTableIfExists('tags');
	await knex.schema.dropTableIfExists('fileTags');
	await knex.schema.dropTableIfExists('bans');
};
