export default {
	summary: 'Get public snippet',
	description: 'Get a public snippet',
	tags: ['Snippets'],
	response: {
		200: {
			type: 'object',
			properties: {
				message: { $ref: 'ResponseMessage' },
				snippet: {
					type: 'object',
					properties: {
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
						}
					}
				}
			}
		},
		'4xx': { $ref: 'HTTP4xxError' },
		'5xx': { $ref: 'HTTP5xxError' }
	}
};
