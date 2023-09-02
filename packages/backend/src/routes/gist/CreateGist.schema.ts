export default {
	summary: 'Create gist',
	description: 'Create a new gist',
	tags: ['Gists'],
	body: {
		type: 'object',
		properties: {
			name: {
				type: 'string',
				description: 'The name of the gist.'
			},
			content: {
				type: 'string',
				description: 'The content of the gist.'
			},
			language: {
				type: 'string',
				description: 'The language of the gist.'
			}
		},
		required: ['content']
	},
	response: {
		200: {
			type: 'object',
			properties: {
				message: { $ref: 'ResponseMessage' },
				gist: {
					type: 'object',
					properties: {
						uuid: {
							type: 'string',
							description: 'The uuid of the gist.',
							example: '1453821d-aaf9-435c-8a51-e3f16f7d2ee5'
						},
						raw: {
							type: 'string',
							description: 'The raw link of the gist.',
							example: 'https://chibisafe.moe/api/gist/random-identifier'
						},
						link: {
							type: 'string',
							description: 'The link of the gist.',
							example: 'https://chibisafe.moe/gist/random-identifier'
						}
					}
				}
			}
		},
		'4xx': { $ref: 'HTTP4xxError' },
		'5xx': { $ref: 'HTTP5xxError' }
	}
};
