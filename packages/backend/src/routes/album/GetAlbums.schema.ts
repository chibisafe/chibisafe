export default {
	summary: 'Get albums',
	description: 'Gets all the albums',
	tags: ['Albums'],
	response: {
		200: {
			type: 'object',
			properties: {
				message: { $ref: 'ResponseMessage' },
				albums: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							uuid: {
								type: 'string',
								description: 'The uuid of the album.',
								example: '1453821d-aaf9-435c-8a51-e3f16f7d2ee5'
							},
							name: { type: 'string', description: 'The name of the album.', example: 'My Album' },
							description: {
								type: 'string',
								description: 'The description of the album.',
								example: 'My album description.'
							},
							nsfw: { type: 'boolean', description: 'Whether or not the album is NSFW.', example: false },
							zippedAt: {
								type: 'string',
								description: 'The date and time the album was last zipped.',
								example: '2021-01-01T00:00:00.000Z'
							},
							createdAt: {
								type: 'string',
								description: 'The date and time the album was created.',
								example: '2021-01-01T00:00:00.000Z'
							},
							editedAt: {
								type: 'string',
								description: 'The date and time the album was last edited.',
								example: '2021-01-01T00:00:00.000Z'
							},
							cover: {
								type: 'string',
								description: 'The cover image of the album.',
								example: 'https://chibisafe.moe/cover.jpg'
							},
							count: { type: 'number', description: 'The amount of images in the album.', example: 5 }
						}
					}
				}
			}
		},
		'4xx': { $ref: 'HTTP4xxError' },
		'5xx': { $ref: 'HTTP5xxError' }
	}
};
