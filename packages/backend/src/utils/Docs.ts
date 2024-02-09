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
