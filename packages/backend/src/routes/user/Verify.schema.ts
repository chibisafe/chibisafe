export default {
	summary: 'Return the current user',
	tags: ['User'],
	response: {
		200: {
			type: 'object',
			properties: {
				user: { $ref: 'RequestUser' }
			}
		},
		'4xx': { $ref: 'HTTP4xxError' },
		'5xx': { $ref: 'HTTP5xxError' }
	}
};
