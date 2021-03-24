exports.up = async knex => {
	await knex.schema.createTable('settings', table => {
		table.string('routePrefix');
		table.integer('rateLimitWindow');
		table.integer('rateLimitMax');
		table.string('secret');
		table.string('serviceName');
		table.string('domain');
		table.integer('chunkSize');
		table.integer('maxSize');
		table.boolean('generateZips');
		table.integer('generatedFilenameLength');
		table.integer('generatedAlbumLength');
		table.integer('maxLinksPerAlbum');
		table.string('uploadFolder');
		table.json('blockedExtensions');
		table.boolean('publicMode');
		table.boolean('userAccounts');
		table.string('adminAccount');
		table.string('adminPassword');
		table.string('metaThemeColor');
		table.string('metaDescription');
		table.string('metaKeywords');
		table.string('metaTwitterHandle');
	});
};

exports.down = async knex => {
	await knex.schema.dropTableIfExists('settings');
};
