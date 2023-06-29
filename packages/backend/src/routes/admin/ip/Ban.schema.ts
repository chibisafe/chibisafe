export default {
	summary: 'Ban IP',
	description: 'Ban an IP address from using the service',
	tags: ['IP Management'],
	body: {
		type: 'object',
		properties: {
			ip: {
				type: 'string',
				description: 'The IP address to ban.'
			}
		},
		required: ['ip']
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
