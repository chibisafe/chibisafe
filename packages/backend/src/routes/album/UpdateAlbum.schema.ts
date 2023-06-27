export default {
	description: 'Updates an album',
	tags: ['Albums'],
	params: {
		type: 'object',
		properties: {
			uuid: {
				type: 'string',
				description: 'The uuid of the album.'
			}
		},
		required: ['uuid']
	},
	body: {
		type: 'object',
		properties: {
			name: {
				type: 'string',
				description: 'The name of the album.'
			},
			nsfw: {
				type: 'boolean',
				description: 'Whether the album is nsfw or not.'
			}
		},
		minProperties: 1,
		additionalProperties: false,
		anyOf: [{ required: ['name'] }, { required: ['nsfw'] }]
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
