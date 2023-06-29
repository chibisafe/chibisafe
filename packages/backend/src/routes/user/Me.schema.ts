export default {
	summary: 'Get own user',
	description: 'Return the current user',
	tags: ['User'],
	response: {
		200: {
			type: 'object',
			properties: {
				message: { $ref: 'ResponseMessage' },
				user: { $ref: 'RequestUser' },
				storageQuota: { $ref: 'StorageQuota' }
			}
		},
		'4xx': { $ref: 'HTTP4xxError' },
		'5xx': { $ref: 'HTTP5xxError' }
	}
};
