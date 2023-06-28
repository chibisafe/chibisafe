export default {
	summary: 'Unban IP',
	description: 'Unban an IP address',
	tags: ['IP Management'],
	body: {
		type: 'object',
		properties: {
			ip: {
				type: 'string',
				description: 'The IP address to unban.'
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
