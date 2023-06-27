export default {
	description: 'Gets the content of an album.',
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
	query: {
		type: 'object',
		properties: {
			page: { $ref: 'QueryPage' },
			limit: { $ref: 'QueryLimit' }
		}
	},
	response: {
		200: {
			type: 'object',
			properties: {
				message: { $ref: 'ResponseMessage' },
				album: {
					type: 'object',
					properties: {
						name: { type: 'string', description: 'The name of the album.', example: 'Cats' },
						isNsfw: { type: 'boolean', description: 'Whether or not the album is nsfw.', example: false },
						filesCount: { type: 'number', description: 'The number of files in the album.', example: 1 },
						files: {
							type: 'array',
							items: {
								$ref: 'FilesAsUser'
							}
						}
					}
				}
			}
		},
		'4xx': { $ref: 'HTTP4xxError' },
		'5xx': { $ref: 'HTTP5xxError' }
	}
};
