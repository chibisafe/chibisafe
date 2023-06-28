export default {
	summary: 'Register',
	description: 'Create a new user account',
	tags: ['Auth'],
	body: {
		type: 'object',
		properties: {
			username: {
				type: 'string',
				description: 'The username of the user.'
			},
			password: {
				type: 'string',
				description: 'The password of the user.'
			}
		},
		required: ['username', 'password']
	},
	headers: {
		type: 'object',
		properties: {
			invite: {
				type: 'string',
				description: 'The invite code to use.'
			}
		}
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
