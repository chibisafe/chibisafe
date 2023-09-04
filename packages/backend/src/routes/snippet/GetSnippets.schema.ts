export default {
	summary: 'Get snippets',
	description: 'Return a list of snippets belonging to the user',
	tags: ['Snippets'],
	query: {
		type: 'object',
		properties: {
			page: { $ref: 'QueryPage' },
			limit: { $ref: 'QueryLimit' }
		}
	},
	response: {
		200: {
			type: 'object',
			properties: {
				message: { $ref: 'ResponseMessage' },
				snippets: {
					type: 'array',
					description: 'An array of snippets belonging to the user.',
					items: {
						type: 'object',
						properties: {
							uuid: {
								type: 'string',
								description: 'The UUID of the snippet.',
								example: '1453821d-aaf9-435c-8a51-e3f16f7d2ee5'
							},
							parentUuid: {
								type: 'string',
								description: 'The parent UUID of the snippet if any.',
								example: '1453821d-aaf9-435c-8a51-e3f16f7d2ee5'
							},
							name: {
								type: 'string',
								description: 'The name of the snippet.',
								example: 'HelloWorld.ts'
							},
							content: {
								type: 'string',
								description: 'The content of the snippet.',
								example: 'const message = "Hello World!";'
							},
							language: {
								type: 'string',
								description: 'The language of the snippet.',
								example: 'TypeScript'
							},
							raw: {
								type: 'string',
								description: 'The direct link to the snippet.',
								example: 'TypeScript'
							},
							link: {
								type: 'string',
								description: 'The link to the snippet.',
								example: 'TypeScript'
							},
							createdAt: {
								type: 'string',
								description: 'The date the snippet was created.',
								example: '2021-01-01T00:00:00.000Z'
							}
						}
					}
				}
			}
		},
		'4xx': { $ref: 'HTTP4xxError' },
		'5xx': { $ref: 'HTTP5xxError' }
	}
};
