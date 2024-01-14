export default {
	summary: 'Get diagnostics',
	description: 'Returns the instance diagnostics for debugging problems',
	tags: ['Server'],
	response: {
		200: {
			type: 'object',
			properties: {
				diagnostics: {
					type: 'string'
				}
			}
		},
		'4xx': { $ref: 'HTTP4xxError' },
		'5xx': { $ref: 'HTTP5xxError' }
	}
};
