const log = require('../utils/Log');
const { server } = require('../../../config');
const db = require('knex')(server.database);
const bcrypt = require('bcrypt');
const moment = require('moment');
const randomstring = require('randomstring');

class Database {
	constructor() {
		this.createTables();
	}

	async createTables() {
		if (!await db.schema.hasTable('users')) {
			await db.schema.createTable('users', table => {
				table.increments();
				table.string('username');
				table.string('password');
				table.boolean('enabled').defaultTo(true);
				table.boolean('isAdmin').defaultTo(false);
				table.string('apiKey');
				table.timestamp('passwordEditedAt');
				table.timestamp('apiKeyEditedAt');
				table.timestamp('createdAt');
				table.timestamp('editedAt');
			});
		}

		if (!await db.schema.hasTable('albums')) {
			await db.schema.createTable('albums', table => {
				table.increments();
				table.integer('userId');
				table.string('name');
				// table.string('identifier');
				// table.boolean('enabled');
				// table.boolean('enableDownload').defaultTo(true);
				table.timestamp('createdAt');
				table.timestamp('editedAt');
			});
		}

		if (!await db.schema.hasTable('files')) {
			await db.schema.createTable('files', table => {
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
		}

		if (!await db.schema.hasTable('links')) {
			await db.schema.createTable('links', table => {
				table.increments();
				table.integer('albumId');
				table.string('identifier');
				table.integer('views').defaultTo(0);
				table.boolean('enabled').defaultTo(true);
				table.boolean('enableDownload').defaultTo(true);
				table.timestamp('expiresAt');
				table.timestamp('createdAt');
				table.timestamp('editedAt');
			});
		}

		if (!await db.schema.hasTable('albumsFiles')) {
			await db.schema.createTable('albumsFiles', table => {
				table.increments();
				table.integer('albumId');
				table.integer('fileId');
			});
		}

		if (!await db.schema.hasTable('albumsLinks')) {
			await db.schema.createTable('albumsLinks', table => {
				table.increments();
				table.integer('albumId');
				table.integer('linkId');
			});
		}

		const now = moment.utc().toDate();
		const user = await db.table('users').where({ username: 'root' }).first();
		if (user) return;
		try {
			const hash = await bcrypt.hash('root', 10);
			await db.table('users').insert({
				username: 'root',
				password: hash,
				apiKey: randomstring.generate(64),
				passwordEditedAt: now,
				apiKeyEditedAt: now,
				createdAt: now,
				editedAt: now,
				isAdmin: true
			});
			log.success('Successfully created the root user with password "root". Make sure to log in and change it!');
		} catch (error) {
			log.error(error);
			if (error) log.error('Error generating password hash for root');
		}
	}
}

module.exports = Database;
