export default {
	summary: '🔒 Get stats',
	description: 'Returns the current system stats',
	tags: ['Server'],
	params: {
		type: 'object',
		properties: {
			force: {
				type: 'string',
				description: 'Whether to force the generation of all stats categories.'
			}
		}
	},
	response: {
		200: {
			type: 'object',
			properties: {
				statistics: {
					type: 'array',
					items: {
						type: 'object',
						additionalProperties: true
					}
				}
			}
		},
		'4xx': { $ref: 'HTTP4xxError' },
		'5xx': { $ref: 'HTTP5xxError' }
	}
};
