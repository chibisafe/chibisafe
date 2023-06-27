export default {
	$id: 'HTTP5xxError',
	type: 'object',
	description: 'An error response.',
	properties: {
		statusCode: {
			type: 'number',
			description: 'HTTP status code',
			example: 500
		},
		error: {
			type: 'string',
			description: 'HTTP status description',
			example: 'Internal Server Error'
		},
		message: { $ref: 'ResponseMessage' }
	}
};
