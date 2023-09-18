export default {
	summary: 'Purge files',
	description: 'Purge all files uploaded from an IP address',
	tags: ['Files', 'IP Management'],
	body: {
		type: 'object',
		properties: {
			ip: {
				type: 'string',
				description: 'The IP address to purge files from.'
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
