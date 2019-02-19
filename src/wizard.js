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
			handle: 'serverPort'
		},
		{
			type: 'input',
			query: 'Port to run the Website in:',
			handle: 'websitePort'
		},
		{
			type: 'input',
			query: 'Full domain this instance is gonna be running on (Ex: https://lolisafe.moe):',
			handle: 'fullDomain'
		},
		{
			type: 'input',
			query: 'Maximum allowed upload file size in MB (Ex: 100):',
			handle: 'maxSize'
		},
		{
			type: 'confirm',
			query: 'Generate thumbnails for images/videos? (Requires ffmpeg installed and in your PATH)',
			handle: 'generateThumbnails',
			accept: 'y',
			deny: 'n'
		},
		{
			type: 'confirm',
			query: 'Allow users to download entire albums in ZIP format?',
			handle: 'generateZips',
			accept: 'y',
			deny: 'n'
		},
		{
			type: 'interactive',
			query: 'How would you like to serve the uploaded files?',
			handle: 'serveWithNode',
			menu: [
				'With NGINX (Faster but needs a bit more setup)',
				'With node'
			]
		},
		{
			type: 'confirm',
			query: 'Run lolisafe in public mode?',
			handle: 'publicMode',
			accept: 'y',
			deny: 'n'
		},
		{
			type: 'confirm',
			query: 'Enable user signup for new accounts?',
			handle: 'enableUserAccounts',
			accept: 'y',
			deny: 'n'
		},
		{
			type: 'secure',
			query: 'Type a secure password for the root user:',
			handle: 'rootPassword'
		}
	];

	const response = await qoa.prompt(wizard);
	console.log(response);
}

start();
