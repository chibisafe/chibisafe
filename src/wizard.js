const jetpack = require('fs-jetpack');
const qoa = require('qoa');
qoa.config({
	prefix: '>',
	underlineQuery: false
});

async function start() {
	const confirm = await qoa.confirm({
		type: 'confirm',
		query: 'Would you like to run the setup wizard now?',
		handle: 'run',
		accept: 'y',
		deny: 'n'
	});
	if (!confirm.run) process.exit(0);

	const wizard = [
		{
			type: 'input',
			query: 'Port to run the API in:',
			handle: 'SERVER_PORT'
		},
		{
			type: 'input',
			query: 'Port to run the Website in:',
			handle: 'WEBSITE_PORT'
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
			query: 'Generate thumbnails for images/videos? (Requires ffmpeg installed and in your PATH)',
			handle: 'GENERATE_THUMBNAILS',
			accept: 'y',
			deny: 'n'
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
			query: 'Strip EXIF information from uploaded images if possible?',
			handle: 'STRIP_EXIF',
			accept: 'y',
			deny: 'n'
		},
		{
			type: 'confirm',
			query: 'Serve files with node?',
			handle: 'SERVE_WITH_NODE',
			accept: 'y',
			deny: 'n'
		},
		{
			type: 'input',
			query: 'Base number of characters for generated file URLs (12 should be good enough):',
			handle: 'GENERATED_FILENAME_LENGTH'
		},
		{
			type: 'input',
			query: 'Base number of characters for generated album URLs (6 should be enough):',
			handle: 'GENERATED_ALBUM_LENGTH'
		},
		{
			type: 'confirm',
			query: 'Run lolisafe in public mode? (People will be able to upload without an account)',
			handle: 'PUBLIC_MODE',
			accept: 'y',
			deny: 'n'
		},
		{
			type: 'confirm',
			query: 'Enable user signup for new accounts?',
			handle: 'USER_ACCOUNTS',
			accept: 'y',
			deny: 'n'
		},
		{
			type: 'secure',
			query: 'Type a secure password for the root user:',
			handle: 'ROOT_PASSWORD'
		}
	];

	const response = await qoa.prompt(wizard);
	let envfile = '';

	const defaultSettings = {
		CHUNK_SIZE: 90,
		ROUTE_PREFIX: '/api',
		RATE_LIMIT_WINDOW: 2,
		RATE_LIMIT_MAX: 5,
		DB_CLIENT: 'pg',
		DB_HOST: 'localhost',
		DB_USER: '',
		DB_PASSWORD: '',
		DB_DATABASE: '',
		BLOCKED_EXTENSIONS: ['.jar', '.exe', '.msi', '.com', '.bat', '.cmd', '.scr', '.ps1', '.sh'],
		UPLOAD_FOLDER: 'uploads',
		SECRET: 'SuperSecretPassphraseHere',
		MAX_LINKS_PER_ALBUM: 5
	};

	const allSettings = Object.assign(defaultSettings, response);

	const keys = Object.keys(allSettings);
	for (const item of keys) {
		envfile += `${item}=${allSettings[item]}\n`;
	}
	jetpack.write('.env', envfile);

	console.log();
	console.log('== .env file generated successfully. You can now run lolisafe ==');
	console.log();
}

start();
