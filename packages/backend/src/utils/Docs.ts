import process from 'node:process';

const readme = `
# Welcome to the Chibisafe API
* List 1
* List 2
# Hanekawa is best waifu
![](https://hanekawa.moe/images/1308049606685503489_t1.jpg "title")
`;

export default {
	openapi: {
		info: {
			title: 'Chibisafe API',
			description: readme,
			version: (process.env.npm_package_version as string) ?? 'unknown'
		},
		tags: [
			{
				name: 'Auth',
				description: 'Authentication routes.'
			},
			{
				name: 'User',
				description: 'Routes that return data related to the authenticated user.'
			},
			{
				name: 'Albums',
				description: 'Routes that return data related to albums.'
			},
			{
				name: 'Files',
				description: 'Routes that return data related to files.'
			},
			{
				name: 'Tags',
				description: 'Routes that return data related to tags.'
			},
			{
				name: 'Server',
				description: 'Routes that returns info about the server instance.'
			},
			{
				name: 'Invites',
				description: 'Routes that return data related to invites.'
			},
			{
				name: 'User Management',
				description: 'Routes that return data related to User Management.'
			},
			{
				name: 'IP Management',
				description: 'Routes that return data related to IP Management.'
			},
			{
				name: 'Admin',
				description: 'Routes that return data related to the admin panel.'
			}
		]
	}
};

export const rawHTML = `
<html>
	<head>
		<title>Chibisafe Docs</title>
		<meta charset="UTF-8" />
		<meta https-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
		<script src="https://unpkg.com/@stoplight/elements/web-components.min.js"></script>
		<link rel="stylesheet" href="https://unpkg.com/@stoplight/elements/styles.min.css" />
		<style>
			.SendButtonHolder > div {
				display: none;
			}
			.SendButtonHolder {
				padding-bottom: 0;
			}
		</style>
	</head>
	<body>
		<elements-api
			apiDescriptionUrl="/docs/json"
			router="hash"
			layout="sidebar"
			hideSchemas="true"
			hideExport="true"
			logo="/logo.svg"
		/>
	</body>
</html>

`;

// .ElementsTableOfContentsItem > div > div
