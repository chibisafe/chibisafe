export default {
	summary: 'Create link',
	description: 'Creates a new album link',
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
	response: {
		200: {
			type: 'object',
			properties: {
				message: { $ref: 'ResponseMessage' },
				data: {
					type: 'object',
					properties: {
						identifier: { type: 'string' },
						uuid: { type: 'string' },
						albumId: { type: 'string' },
						enabled: { type: 'boolean' },
						enableDownload: { type: 'boolean' },
						expiresAt: { type: 'string' },
						views: { type: 'number' }
					}
				}
			}
		},
		'4xx': { $ref: 'HTTP4xxError' },
		'5xx': { $ref: 'HTTP5xxError' }
	}
};
