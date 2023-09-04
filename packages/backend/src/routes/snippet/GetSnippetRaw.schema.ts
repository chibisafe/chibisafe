export default {
	summary: 'Get raw snippet',
	description: 'Get a raw snippet',
	tags: ['Snippets'],
	response: {
		200: {
			type: 'string'
		},
		'4xx': { $ref: 'HTTP4xxError' },
		'5xx': { $ref: 'HTTP5xxError' }
	}
};
