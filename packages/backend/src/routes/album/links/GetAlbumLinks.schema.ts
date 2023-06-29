export default {
	summary: 'Get links',
	description: 'Gets all existing album links',
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
				links: {
					type: 'array',
					items: {
						identifier: { type: 'string' },
						uuid: { type: 'string' },
						albumId: { type: 'string' },
						enabled: { type: 'boolean' },
						enableDownload: { type: 'boolean' },
						expiresAt: { type: 'string' },
						views: { type: 'number' },
						createdAt: { type: 'string' },
						editedAt: { type: 'string' }
					}
				}
			}
		},
		'4xx': { $ref: 'HTTP4xxError' },
		'5xx': { $ref: 'HTTP5xxError' }
	}
};
