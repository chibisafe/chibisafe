export default {
	summary: 'Add tag to file',
	description: 'Adds a tag to a file',
	tags: ['Files', 'Tags'],
	params: {
		type: 'object',
		properties: {
			uuid: {
				type: 'string',
				description: 'The uuid of the file.'
			},
			tagUuid: {
				type: 'string',
				description: 'The uuid of the tag.'
			}
		},
		required: ['uuid', 'tagUuid']
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
