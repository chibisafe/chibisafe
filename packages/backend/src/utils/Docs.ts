import { getChibisafeVersion } from './Util.js';

const readme = `
![](/meta.jpg)

# Welcome to the API docs

These are the official docs for the [Chibisafe](https://github.com/chibisafe/chibisafe) project.
On the sidebar you will find all available endpoints that the API has to offer.
Keep in mind that some of those are accesible only to admins of the instance, for operations such as setting up the instance or managing users.

If you want to test the API, we've included a Thunder Client collection that you can import into your IDE of choice if you clone the repo.
If you are using VSCode, you can install the [Thunder Client extension](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client) and the collection should already be imported automatically for you.

The default rate limit for the API is 100 requests per 1000ms.
`;

export default {
	openapi: {
		info: {
			title: 'Chibisafe API',
			description: readme,
			version: getChibisafeVersion()
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
		<script src="https://unpkg.com/@stoplight/elements@7.12.0/web-components.min.js"></script>
		<link rel="stylesheet" href="https://unpkg.com/@stoplight/elements@7.12.0/styles.min.css" />
		<style>
			.SendButtonHolder > div {
				display: none;
			}
			.SendButtonHolder {
				padding-bottom: 0;
			}
			a.ElementsTableOfContentsItem[href*="api-admin-"] > div:before {
				content: 'Admin';
				font-size: 10px;
				margin-right: 6px;
				background: #ffc9d5;
				color: #201f1f;
				padding: 1px 5px;
				border-radius: 3px;
			}
			a.ElementsTableOfContentsItem > div > svg {
				display: none !important;
			}
			@media (min-width: 1800px) {
				.sl-markdown-viewer figure > div {
					width: 80%;
					margin: auto;
				}
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
