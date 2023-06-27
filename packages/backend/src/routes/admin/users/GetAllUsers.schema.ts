export default {
	summary: 'Get all users.',
	tags: ['User Management', 'Admin'],
	response: {
		200: {
			type: 'object',
			properties: {
				message: { $ref: 'ResponseMessage' },
				users: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							// TODO: eventually make this conistent with the other schemas that return a user
							uuid: { $ref: 'UserAsAdmin#/properties/uuid' },
							username: { $ref: 'UserAsAdmin#/properties/username' },
							enabled: { $ref: 'UserAsAdmin#/properties/enabled' },
							isAdmin: { $ref: 'UserAsAdmin#/properties/isAdmin' },
							createdAt: { $ref: 'UserAsAdmin#/properties/createdAt' },
							size: {
								type: 'number',
								description: 'The total size of all files the user has uploaded.',
								example: 0
							},
							_count: {
								type: 'object',
								properties: {
									files: {
										type: 'number',
										description: 'The number of files the user has uploaded.',
										example: 0
									}
								}
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
