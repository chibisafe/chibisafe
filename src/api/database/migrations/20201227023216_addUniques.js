exports.up = async knex => {
	await knex.schema.alterTable('users', table => {
		table.unique(['username', 'apiKey']);
	});

	await knex.schema.alterTable('albums', table => {
		table.boolean('nsfw').defaultTo(false);
		table.unique(['userId', 'name']);
	});

	await knex.schema.alterTable('links', table => {
		table.unique(['userId', 'albumId', 'identifier']);
	});

	await knex.schema.alterTable('albumsFiles', table => {
		table.unique(['albumId', 'fileId']);
	});

	await knex.schema.alterTable('albumsLinks', table => {
		table.unique(['linkId']);
	});

	await knex.schema.alterTable('tags', table => {
		table.unique(['userId', 'name']);
	});

	await knex.schema.alterTable('fileTags', table => {
		table.unique(['fileId', 'tagId']);
	});
};
exports.down = async knex => {
	// Nothing
};
