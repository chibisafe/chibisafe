export default {
	$id: 'HTTP4xxError',
	type: 'object',
	description: 'An error response.',
	properties: {
		statusCode: {
			type: 'number',
			description: 'HTTP status code.',
			example: 401
		},
		error: {
			type: 'string',
			description: 'HTTP status description.',
			example: 'Unauthorized'
		},
		message: { $ref: 'ResponseMessage' }
	}
};
