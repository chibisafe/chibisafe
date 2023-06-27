export default {
	summary: 'Create an invite.',
	tags: ['Invites', 'Admin'],
	response: {
		200: {
			type: 'object',
			properties: {
				message: { $ref: 'ResponseMessage' },
				code: {
					type: 'string',
					description: 'The invite code.',
					example: '1453821d-aaf9-435c-8a51-e3f16f7d2ee5'
				}
			}
		},
		'4xx': { $ref: 'HTTP4xxError' },
		'5xx': { $ref: 'HTTP5xxError' }
	}
};
