export default {
	summary: 'Create album',
	description: 'Creates a new album',
	tags: ['Albums'],
	body: {
		type: 'object',
		properties: {
			name: {
				type: 'string',
				description: 'The name of the album.'
			}
		},
		required: ['name']
	},
	response: {
		200: {
			type: 'object',
			properties: {
				message: { $ref: 'ResponseMessage' },
				album: {
					type: 'object',
					properties: {
						uuid: { type: 'string' },
						name: { type: 'string' },
						createdAt: { type: 'string' }
					}
				}
			}
		},
		'4xx': { $ref: 'HTTP4xxError' },
		'5xx': { $ref: 'HTTP5xxError' }
	}
};
