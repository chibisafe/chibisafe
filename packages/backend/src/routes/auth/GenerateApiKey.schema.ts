export default {
	summary: 'Generate API key',
	description: 'Generate a new API key for the current user',
	tags: ['Auth'],
	response: {
		200: {
			type: 'object',
			properties: {
				message: { $ref: 'ResponseMessage' },
				apiKey: {
					$ref: 'RequestUser#/properties/apiKey'
				}
			}
		},
		'4xx': { $ref: 'HTTP4xxError' },
		'5xx': { $ref: 'HTTP5xxError' }
	}
};
