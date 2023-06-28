export default {
	summary: 'Delete file from album',
	description: 'Deletes a file from an album',
	tags: ['Files', 'Albums'],
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
