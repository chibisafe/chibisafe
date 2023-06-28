export default {
	summary: 'Get user with files',
	description: 'Get a user and their files',
	tags: ['User Management'],
	params: {
		type: 'object',
		properties: {
			uuid: {
				type: 'string',
				description: 'The uuid of the user to get.'
			}
		},
		required: ['uuid']
	},
	query: {
		type: 'object',
		properties: {
			page: { $ref: 'QueryPage' },
			limit: { $ref: 'QueryLimit' }
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
