/* eslint-disable no-console */
const jetpack = require('fs-jetpack');
const qoa = require('qoa');

qoa.config({
	prefix: '>',
	underlineQuery: false
});

async function start() {
	console.log();
	console.log('You can manually edit .env file after the wizard to edit values');
	console.log();

	const { DOMAIN } = await qoa.input({
		query: 'Full domain this instance is gonna be running on (Ex: https://my-super-chibisafe.xyz):',
		handle: 'DOMAIN'
	});

	const { SERVER_PORT } = await qoa.input({
		query: 'Port to run chibisafe in? (default: 5000)',
		handle: 'SERVER_PORT'
	});

	const { ADMIN_PASSWORD } = await qoa.input({
		query: 'Default admin account password (default: "admin"):',
		handle: 'ADMIN_PASSWORD'
	});

	const { DB_CLIENT } = await qoa.interactive({
		query: 'Which database do you want to use? (select sqlite3 if not sure)',
		handle: 'DB_CLIENT',
		symbol: '>',
		menu: [
			'sqlite3',
			'pg',
			'mysql'
		]
	});

	const dbOpts = {};
	if (DB_CLIENT !== 'sqlite3') {
		const { DB_HOST } = await qoa.input({
			type: 'input',
			query: 'Database host (Leave blank if you selected sqlite3):',
			handle: 'DB_HOST'
		});
		Reflect.set(dbOpts, 'DB_HOST', DB_HOST);

		const { DB_USER } = await qoa.input({
			type: 'input',
			query: 'Database user (Leave blank if you selected sqlite3):',
			handle: 'DB_USER'
		});
		Reflect.set(dbOpts, 'DB_USER', DB_USER);

		const { DB_PASSWORD } = await qoa.input({
			type: 'input',
			query: 'Database password (Leave blank if you selected sqlite3):',
			handle: 'DB_PASSWORD'
		});
		Reflect.set(dbOpts, 'DB_PASSWORD', DB_PASSWORD);

		const { DB_DATABASE } = await qoa.input({
			type: 'input',
			query: 'Database name (Leave blank if you selected sqlite3):',
			handle: 'DB_DATABASE'
		});
		Reflect.set(dbOpts, 'DB_DATABASE', DB_DATABASE);
	}

	let envfile = '';

	const defaultSettings = {
		DOMAIN,
		SERVER_PORT: SERVER_PORT || 5000,
		ADMIN_PASSWORD: ADMIN_PASSWORD || 'admin',
		DB_CLIENT,
		DB_HOST: dbOpts.DB_HOST || null,
		DB_USER: dbOpts.DB_USER || null,
		DB_PASSWORD: dbOpts.DB_PASSWORD || null,
		DB_DATABASE: dbOpts.DB_DATABASE || null
	};

	const keys = Object.keys(defaultSettings);

	for (const item of keys) {
		envfile += `${item}=${defaultSettings[item]}\n`;
	}
	jetpack.write('.env', envfile);
	jetpack.dir('database');

	console.log();
	console.log('=====================================================');
	console.log('==        .env file generated successfully.        ==');
	console.log('=====================================================');
	console.log(`== Both your initial user and password are 'admin' ==`);
	console.log('==  MAKE SURE TO CHANGE IT AFTER YOUR FIRST LOGIN  ==');
	console.log('=====================================================');
	console.log();
	setTimeout(() => {}, 1000);
}

start();
