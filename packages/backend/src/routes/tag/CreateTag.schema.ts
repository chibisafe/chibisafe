export default {
	summary: 'Create tag',
	description: 'Create a new tag',
	tags: ['Tags'],
	body: {
		type: 'object',
		properties: {
			name: {
				type: 'string',
				description: 'The name of the tag.'
			}
		},
		required: ['name']
	},
	response: {
		200: {
			type: 'object',
			properties: {
				message: { $ref: 'ResponseMessage' },
				tag: {
					type: 'object',
					properties: {
						uuid: {
							type: 'string',
							description: 'The uuid of the tag.',
							example: '1453821d-aaf9-435c-8a51-e3f16f7d2ee5'
						},
						name: {
							type: 'string',
							description: 'The name of the tag.',
							example: 'Good Stuff'
						},
						createdAt: {
							type: 'string',
							description: 'The date the tag was created.',
							example: '2021-01-01T00:00:00.000Z'
						}
					}
				}
			}
		},
		'4xx': { $ref: 'HTTP4xxError' },
		'5xx': { $ref: 'HTTP5xxError' }
	}
};
