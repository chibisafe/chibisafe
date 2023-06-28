export default {
	summary: 'Edit link',
	description: 'Edits an album link',
	tags: ['Albums'],
	params: {
		type: 'object',
		properties: {
			uuid: {
				type: 'string',
				description: 'The uuid of the album.'
			},
			linkUuid: {
				type: 'string',
				description: 'The uuid of the link.'
			}
		},
		required: ['uuid', 'linkUuid']
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
