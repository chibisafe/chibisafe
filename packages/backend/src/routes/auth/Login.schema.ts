export default {
	summary: 'Login',
	description: 'Login to an existing account',
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
	response: {
		200: {
			type: 'object',
			properties: {
				message: { $ref: 'ResponseMessage' },
				user: {
					$ref: 'RequestUser'
				},
				token: {
					type: 'string',
					description: 'The JWT token.',
					example:
						'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJoYW5la2F3YSIsImV4cCI6MTcxOTE4NDA5NSwic3ViIjoxfQ.NhTq0Qtan0n3OSvBaAWutwjXgEB41ASdhXQQm64V05g'
				}
			}
		},
		'4xx': { $ref: 'HTTP4xxError' },
		'5xx': { $ref: 'HTTP5xxError' }
	}
};
