export default {
	summary: 'Set storage quota',
	description: 'Set the storage quota for a given user',
	tags: ['User Management'],
	params: {
		type: 'object',
		properties: {
			uuid: {
				type: 'string',
				description: 'The uuid of the user.'
			}
		},
		required: ['uuid']
	},
	body: {
		type: 'object',
		properties: {
			space: {
				type: 'number',
				description: 'The amount of space to allocate.'
			}
		},
		required: ['space']
	},
	response: {
		200: {
			type: 'object',
			properties: {
				message: { $ref: 'ResponseMessage' }
			}
		},
		'4xx': { $ref: 'HTTP4xxError' },
		'5xx': { $ref: 'HTTP5xxError' }
	}
};
