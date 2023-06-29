export default {
	summary: 'Change password',
	description: 'Change the password of the current user',
	tags: ['Auth'],
	body: {
		type: 'object',
		properties: {
			password: {
				type: 'string',
				description: 'The current password of the user.'
			},
			newPassword: {
				type: 'string',
				description: 'The new password of the user.'
			}
		},
		required: ['password', 'newPassword']
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
