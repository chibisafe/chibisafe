export default {
	description: 'Returns the current system stats.',
	tags: ['Admin', 'Server'],
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
					type: 'object',
					description: 'The statistics of the system.',
					properties: {
						system: { type: 'object', description: 'The system statistics.' },
						service: { type: 'object', description: 'The service statistics.' },
						fileSystems: { type: 'object', description: 'The file system statistics.' },
						uploads: { type: 'object', description: 'The upload statistics.' },
						albums: { type: 'object', description: 'The album statistics.' },
						users: { type: 'object', description: 'The user statistics.' }
					}
				}
			}
		},
		'4xx': { $ref: 'HTTP4xxError' },
		'5xx': { $ref: 'HTTP5xxError' }
	}
};
