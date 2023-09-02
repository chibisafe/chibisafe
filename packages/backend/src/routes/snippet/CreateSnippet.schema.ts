export default {
	summary: 'Create snippet',
	description: 'Create a new snippet',
	tags: ['Snippets'],
	body: {
		type: 'object',
		properties: {
			name: {
				type: 'string',
				description: 'The name of the snippet.'
			},
			content: {
				type: 'string',
				description: 'The content of the snippet.'
			},
			language: {
				type: 'string',
				description: 'The language of the snippet.'
			}
		},
		required: ['content']
	},
	response: {
		200: {
			type: 'object',
			properties: {
				message: { $ref: 'ResponseMessage' },
				snippet: {
					type: 'object',
					properties: {
						uuid: {
							type: 'string',
							description: 'The uuid of the snippet.',
							example: '1453821d-aaf9-435c-8a51-e3f16f7d2ee5'
						},
						raw: {
							type: 'string',
							description: 'The raw link of the snippet.',
							example: 'https://chibisafe.moe/api/snippet/random-identifier'
						},
						link: {
							type: 'string',
							description: 'The link of the snippet.',
							example: 'https://chibisafe.moe/snippet/random-identifier'
						}
					}
				}
			}
		},
		'4xx': { $ref: 'HTTP4xxError' },
		'5xx': { $ref: 'HTTP5xxError' }
	}
};
