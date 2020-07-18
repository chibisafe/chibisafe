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
			query: 'Port to run lolisafe in:',
			handle: 'SERVER_PORT'
		},
		{
			type: 'input',
			query: 'Full domain this instance is gonna be running on (Ex: https://lolisafe.moe):',
			handle: 'DOMAIN'
		},
		{
			type: 'input',
			query: 'Name of the service? (Ex: lolisafe):',
			handle: 'SERVICE_NAME'
		},
		{
			type: 'input',
			query: 'Maximum allowed upload file size in MB (Ex: 100):',
			handle: 'MAX_SIZE'
		},
		{
			type: 'confirm',
			query: 'Allow users to download entire albums in ZIP format?',
			handle: 'GENERATE_ZIPS',
			accept: 'y',
			deny: 'n'
		},
		{
			type: 'confirm',
			query: 'Allow people to upload files without an account?',
			handle: 'PUBLIC_MODE',
			accept: 'y',
			deny: 'n'
		},
		{
			type: 'confirm',
			query: 'Allow people to create new accounts?',
			handle: 'USER_ACCOUNTS',
			accept: 'y',
			deny: 'n'
		},
		{
			type: 'input',
			query: 'Name of the admin account?',
			handle: 'ADMIN_ACCOUNT'
		},
		{
			type: 'secure',
			query: 'Type a secure password for the admin account:',
			handle: 'ADMIN_PASSWORD'
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
		GENERATED_FILENAME_LENGTH: 12,
		GENERATED_ALBUM_LENGTH: 6,
		WEBSITE_PORT: 5001,
		SERVE_WITH_NODE: true,
		GENERATE_THUMBNAILS: true,
		CHUNK_SIZE: 90,
		ROUTE_PREFIX: '/api',
		RATE_LIMIT_WINDOW: 2,
		RATE_LIMIT_MAX: 5,
		BLOCKED_EXTENSIONS: ['.jar', '.exe', '.msi', '.com', '.bat', '.cmd', '.scr', '.ps1', '.sh'],
		UPLOAD_FOLDER: 'uploads',
		SECRET: randomstring.generate(64),
		MAX_LINKS_PER_ALBUM: 5,
		META_THEME_COLOR: '#20222b',
		META_DESCRIPTION: 'Blazing fast file uploader and bunker written in node! 🚀',
		META_KEYWORDS: 'lolisafe,upload,uploader,file,vue,images,ssr,file uploader,free',
		META_TWITTER_HANDLE: '@its_pitu'
	};

	const allSettings = Object.assign(defaultSettings, response);

	const keys = Object.keys(allSettings);
	for (const item of keys) {
		envfile += `${item}=${allSettings[item]}\n`;
	}
	jetpack.write('.env', envfile);

	console.log();
	console.log('=============================================');
	console.log('==    .env file generated successfully.    ==');
	console.log('=============================================');
	console.log();
}

start();
