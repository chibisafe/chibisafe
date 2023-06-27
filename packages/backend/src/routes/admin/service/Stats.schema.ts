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
		'4xx': { $ref: 'HTTP4xxError' },
		'5xx': { $ref: 'HTTP5xxError' }
	}
};
