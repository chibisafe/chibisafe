export default {
	summary: 'Get user',
	description: 'Get a user',
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
	response: {
		200: {
			type: 'object',
			properties: {
				message: { $ref: 'ResponseMessage' },
				user: {
					type: 'object',
					properties: {
						uuid: { $ref: 'UserAsAdmin#/properties/uuid' },
						username: { $ref: 'UserAsAdmin#/properties/username' },
						enabled: { $ref: 'UserAsAdmin#/properties/enabled' },
						roles: { $ref: 'UserAsAdmin#/properties/roles' },
						createdAt: { $ref: 'UserAsAdmin#/properties/createdAt' },
						editedAt: { $ref: 'UserAsAdmin#/properties/editedAt' },
						apiKeyEditedAt: {
							type: 'string',
							description: 'The date the user last edited their API key.',
							example: '2020-01-01T00:00:00.000Z'
						}
					}
				}
			}
		},
		'4xx': { $ref: 'HTTP4xxError' },
		'5xx': { $ref: 'HTTP5xxError' }
	}
};
