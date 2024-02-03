export default {
	summary: 'Get settings',
	description: 'Get the current settings of the instance',
	tags: ['Server'],
	response: {
		200: {
			type: 'object',
			properties: {
				serviceName: {
					type: 'string',
					description: 'The name of the service.',
					example: 'Chibisafe'
				},
				chunkSize: {
					type: 'number',
					description: 'The size of each chunk in bytes.',
					example: 90000000
				},
				maxSize: {
					type: 'number',
					description: 'The maximum size of a file in bytes.',
					example: 1000000000
				},
				logoURL: {
					type: 'string',
					description: 'The URL of the logo.',
					example: 'https://chibisafe.moe/logo.png'
				},
				backgroundImageURL: {
					type: 'string',
					description: 'The URL of the background image.',
					example: 'https://chibisafe.moe/background.png'
				},
				publicMode: {
					type: 'boolean',
					description: 'Whether or not the service is in public mode.',
					example: false
				},
				userAccounts: {
					type: 'boolean',
					description: 'Whether or not user accounts are enabled.',
					example: false
				},
				blockedExtensions: {
					type: 'array',
					description: 'The list of blocked extensions.',
					items: {
						type: 'string',
						example: 'exe'
					}
				},
				useNetworkStorage: {
					type: 'boolean',
					description: 'Whether or not network storage is enabled.',
					example: false
				}
			}
		}
	}
};
