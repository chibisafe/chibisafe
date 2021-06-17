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

	const wizard = [
		{
			type: 'input',
			query: 'Full domain this instance is gonna be running on (Ex: https://my-super-chibisafe.xyz):',
			handle: 'DOMAIN'
		},
		{
			type: 'input',
			query: 'Port to run chibisafe in? (default: 5000)',
			handle: 'SERVER_PORT'
		},
		{
			type: 'interactive',
			query: 'Which database do you want to use? (select sqlite3 if not sure)',
			handle: 'DB_CLIENT',
			symbol: '>',
			menu: [
				'sqlite3',
				'pg',
				'mysql'
			]
		},
		{
			type: 'input',
			query: 'Database host (Leave blank if you selected sqlite3):',
			handle: 'DB_HOST'
		},
		{
			type: 'input',
			query: 'Database user (Leave blank if you selected sqlite3):',
			handle: 'DB_USER'
		},
		{
			type: 'input',
			query: 'Database password (Leave blank if you selected sqlite3):',
			handle: 'DB_PASSWORD'
		},
		{
			type: 'input',
			query: 'Database name (Leave blank if you selected sqlite3):',
			handle: 'DB_DATABASE'
		}
	];

	const response = await qoa.prompt(wizard);
	let envfile = '';

	const defaultSettings = {
		DOMAIN: response.DOMAIN,
		SERVER_PORT: response.SERVER_PORT || 5000,
		DB_CLIENT: response.DB_CLIENT,
		DB_HOST: response.DB_HOST || null,
		DB_USER: response.DB_USER || null,
		DB_PASSWORD: response.DB_PASSWORD || null,
		DB_DATABASE: response.DB_DATABASE || null
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
