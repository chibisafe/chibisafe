export default {
	description: 'Adds a file to an album.',
	tags: ['Files', 'Albums', 'API Key'],
	params: {
		type: 'object',
		properties: {
			uuid: {
				type: 'string',
				description: 'The uuid of the file.'
			},
			albumUuid: {
				type: 'string',
				description: 'The uuid of the album.'
			}
		},
		required: ['uuid', 'albumUuid']
	},
	response: {
		200: {
			type: 'object',
			properties: {
				message: { $ref: 'ResponseMessage' }
			}
		},
		'4xx': { $ref: 'HTTP4xxError' },
		'5xx': { $ref: 'HTTP5xxError' }
	}
};
