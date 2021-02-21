/* eslint-disable no-console */
const randomstring = require('randomstring');
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
			query: 'Port to run chibisafe in: (5000)',
			handle: 'SERVER_PORT'
		},
		{
			type: 'input',
			query: 'Full domain this instance is gonna be running on (Ex: https://chibisafe.moe):',
			handle: 'DOMAIN'
		},
		{
			type: 'input',
			query: 'Name of the service? (Ex: chibisafe):',
			handle: 'SERVICE_NAME'
		},
		{
			type: 'input',
			query: 'Maximum allowed upload file size in MB (Ex: 100):',
			handle: 'MAX_SIZE'
		},
		{
			type: 'confirm',
			query: 'Allow users to download entire albums in ZIP format? (true)',
			handle: 'GENERATE_ZIPS',
			accept: 'y',
			deny: 'n'
		},
		{
			type: 'confirm',
			query: 'Allow people to upload files without an account? (true)',
			handle: 'PUBLIC_MODE',
			accept: 'y',
			deny: 'n'
		},
		{
			type: 'confirm',
			query: 'Allow people to create new accounts? (true)',
			handle: 'USER_ACCOUNTS',
			accept: 'y',
			deny: 'n'
		},
		{
			type: 'input',
			query: 'Name of the admin account? (admin)',
			handle: 'ADMIN_ACCOUNT'
		},
		{
			type: 'interactive',
			query: 'Which predefined database do you want to use?',
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
			query: 'Database host (Ignore if you selected sqlite3):',
			handle: 'DB_HOST'
		},
		{
			type: 'input',
			query: 'Database user (Ignore if you selected sqlite3):',
			handle: 'DB_USER'
		},
		{
			type: 'input',
			query: 'Database password (Ignore if you selected sqlite3):',
			handle: 'DB_PASSWORD'
		},
		{
			type: 'input',
			query: 'Database name (Ignore if you selected sqlite3):',
			handle: 'DB_DATABASE'
		}
	];

	const response = await qoa.prompt(wizard);
	let envfile = '';

	const defaultSettings = {
		_1: '# Server settings',
		SERVER_PORT: response.SERVER_PORT || 5000,
		WEBSITE_PORT: 5001,
		ROUTE_PREFIX: '/api',
		RATE_LIMIT_WINDOW: 2,
		RATE_LIMIT_MAX: 5,
		SECRET: randomstring.generate(64),

		_2: '# Service settings',
		SERVICE_NAME: response.SERVICE_NAME || 'change-me',
		DOMAIN: response.DOMAIN || `http://localhost:${response.SERVER_PORT}`,

		_3: '# File related settings',
		CHUNK_SIZE: 90,
		MAX_SIZE: response.MAX_SIZE || 5000,
		GENERATE_ZIPS: response.GENERATE_ZIPS == undefined ? true : false,
		GENERATED_FILENAME_LENGTH: 12,
		GENERATED_ALBUM_LENGTH: 6,
		MAX_LINKS_PER_ALBUM: 5,
		UPLOAD_FOLDER: 'uploads',
		BLOCKED_EXTENSIONS: ['.jar', '.exe', '.msi', '.com', '.bat', '.cmd', '.scr', '.ps1', '.sh'],

		_4: '# User settings',
		PUBLIC_MODE: response.PUBLIC_MODE == undefined ? true : false,
		USER_ACCOUNTS: response.USER_ACCOUNTS == undefined ? true : false,
		ADMIN_ACCOUNT: response.ADMIN_ACCOUNT || 'admin',
		ADMIN_PASSWORD: randomstring.generate(16),

		_5: '# Database connection settings',
		DB_CLIENT: response.DB_CLIENT,
		DB_HOST: response.DB_HOST || null,
		DB_USER: response.DB_USER || null,
		DB_PASSWORD: response.DB_PASSWORD || null,
		DB_DATABASE: response.DB_DATABASE || null,

		_6: '# Social and sharing settings',
		META_THEME_COLOR: '#20222b',
		META_DESCRIPTION: 'Blazing fast file uploader and bunker written in node! 🚀',
		META_KEYWORDS: 'chibisafe,lolisafe,upload,uploader,file,vue,images,ssr,file uploader,free',
		META_TWITTER_HANDLE: '@its_pitu'
	};

	const keys = Object.keys(defaultSettings);

	for (const item of keys) {
		let prefix = `${item}=`;
		if (item.startsWith('_1')) {
			prefix = '';
		} else if (item.startsWith('_')) {
			prefix = '\n';
		}
		envfile += `${prefix}${defaultSettings[item]}\n`;
	}
	jetpack.write('.env', envfile);
	jetpack.dir('database');

	console.log();
	console.log('====================================================');
	console.log('==        .env file generated successfully.       ==');
	console.log('====================================================');
	console.log(`== Your admin password is: ${defaultSettings.ADMIN_PASSWORD}       ==`);
	console.log('== MAKE SURE TO CHANGE IT AFTER YOUR FIRST LOGIN! ==');
	console.log('====================================================');
	console.log();
	setTimeout(() => {}, 1000);
}

start();
