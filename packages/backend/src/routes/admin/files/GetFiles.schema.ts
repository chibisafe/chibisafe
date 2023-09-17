export default {
	summary: 'Get all files',
	description: 'Gets all files as admin',
	tags: ['Files'],
	query: {
		type: 'object',
		properties: {
			publicOnly: {
				type: 'boolean',
				description: 'Whether to only get public files.'
			},
			page: { $ref: 'QueryPage' },
			limit: { $ref: 'QueryLimit' },
			quarantine: {
				type: 'boolean',
				description: 'Whether to only get quarantined files.'
			}
		}
	},
	response: {
		200: {
			type: 'object',
			properties: {
				message: { $ref: 'ResponseMessage' },
				files: {
					type: 'array',
					items: {
						$ref: 'FilesAsAdmin'
					}
				},
				count: {
					type: 'number',
					description: 'The amount of files that exist.'
				}
			}
		},
		'4xx': { $ref: 'HTTP4xxError' },
		'5xx': { $ref: 'HTTP5xxError' }
	}
};
