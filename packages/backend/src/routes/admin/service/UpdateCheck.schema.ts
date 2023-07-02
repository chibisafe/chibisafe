export default {
	summary: 'Check for updates',
	description: 'Check if there is a new version of Chibisafe available',
	tags: ['Server'],
	response: {
		200: {
			type: 'object',
			properties: {
				updateAvailable: {
					type: 'boolean',
					description: 'Whether or not an update is available',
					example: true
				},
				latestVersion: {
					type: 'string',
					description: 'The latest version of Chibisafe',
					example: '5.1.4'
				},
				latestVersionUrl: {
					type: 'string',
					description: 'The URL to the latest version of Chibisafe',
					example: 'https://github.com/chibisafe/chibisafe/releases/tag/v5.1.4'
				},
				releaseNotes: {
					type: 'array',
					description: 'The release notes for the latest version of Chibisafe',
					items: {
						type: 'object',
						properties: {
							version: {
								type: 'string',
								description: 'The version of Chibisafe',
								example: '5.1.4'
							},
							url: {
								type: 'string',
								description: 'The URL to the release',
								example: 'https://github.com/chibisafe/chibisafe/releases/tag/v5.1.4'
							},
							name: {
								type: 'string',
								description: 'The name of the release',
								example: 'Bug fixes'
							},
							body: {
								type: 'string',
								description: 'The release notes',
								example: 'Fixed a bug'
							}
						}
					}
				}
			}
		},
		'4xx': { $ref: 'HTTP4xxError' },
		'5xx': { $ref: 'HTTP5xxError' }
	}
};
