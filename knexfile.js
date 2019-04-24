require('dotenv').config();

module.exports = {
	client: process.env.DB_CLIENT,
	connection: {
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
		filename: 'database.sqlite'
	},
	pool: {
		min: process.env.DATABASE_POOL_MIN || 2,
		max: process.env.DATABASE_POOL_MAX || 10
	},
	migrations: {
		directory: 'src/api/database/migrations'
	},
	seeds: {
		directory: 'src/api/database/seeds'
	},
	useNullAsDefault: process.env.DB_CLIENT === 'sqlite3' ? true : false
};
