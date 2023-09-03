export default {
	summary: 'Get users',
	description: 'Get all users',
	tags: ['User Management'],
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
							uuid: { $ref: 'UserAsAdmin#/properties/uuid' },
							username: { $ref: 'UserAsAdmin#/properties/username' },
							enabled: { $ref: 'UserAsAdmin#/properties/enabled' },
							roles: { $ref: 'UserAsAdmin#/properties/roles' },
							createdAt: { $ref: 'UserAsAdmin#/properties/createdAt' },
							storageQuota: { $ref: 'StorageQuota' },
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
