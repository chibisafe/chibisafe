const nodePath = require('path');
const Knex = require('knex');

// eslint-disable-next-line func-names
Knex.QueryBuilder.extend('wasMutated', function() {
	this.client.config.userParams.lastMutationTime = Date.now();
	return this;
});

const db = Knex({
	client: process.env.DB_CLIENT,
	connection: {
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
		filename: nodePath.join(__dirname, '../../../database/database.sqlite')
	},
	postProcessResponse: result => {
		/*
			Fun fact: Depending on the database used by the user and given that I don't want
			to force a specific database for everyone because of the nature of this project,
			some things like different data types for booleans need to be considered like in
			the implementation below where sqlite returns 1 and 0 instead of true and false.
		*/
		const booleanFields = ['enabled', 'enableDownload', 'isAdmin', 'nsfw', 'generateZips', 'publicMode', 'userAccounts'];

		const processResponse = row => {
			Object.keys(row).forEach(key => {
				if (booleanFields.includes(key)) {
					if (row[key] === 0) row[key] = false;
					else if (row[key] === 1) row[key] = true;
				}
			});
			return row;
		};

		if (Array.isArray(result)) return result.map(row => processResponse(row));
		if (typeof result === 'object') return processResponse(result);
		return result;
	},
	useNullAsDefault: process.env.DB_CLIENT === 'sqlite3',
	log: {
		warn: msg => {
			if (typeof msg === 'string' && msg.startsWith('.returning()')) return;
			console.warn(msg);
		}
	},
	userParams: {
		lastMutationTime: null
	}
});

module.exports = db;
