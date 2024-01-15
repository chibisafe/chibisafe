export default {
	summary: 'Get public link',
	description: 'Gets a public album link with its contents',
	tags: ['Albums'],
	params: {
		type: 'object',
		properties: {
			identifier: {
				type: 'string',
				description: 'The identifier of the link used to access the album.'
			}
		},
		required: ['identifier']
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
						name: { type: 'string', description: 'The name of the album.', example: 'My Album' },
						description: {
							type: 'string',
							description: 'The description of the album.',
							example: 'My great album about dogs.'
						},
						isNsfw: { type: 'boolean', description: 'Whether or not the album is NSFW.', example: false },
						count: { type: 'number', description: 'The amount of files in the album.', example: 5 },
						files: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									name: { type: 'string', description: 'The name of the file.', example: 'cat.png' },
									type: {
										type: 'string',
										description: 'The type of the file.',
										example: 'image/png'
									},
									url: {
										type: 'string',
										description: 'The URL of the file.',
										example: 'https://example.com/cat.png'
									},
									thumb: {
										type: 'string',
										description: 'The URL of the thumbnail of the file.',
										example: 'https://example.com/cat.png'
									},
									thumbSquare: {
										type: 'string',
										description: 'The URL of the square thumbnail of the file.',
										example: 'https://example.com/cat.png'
									},
									preview: {
										type: 'string',
										description: 'The URL of the preview of the file.',
										example: 'https://example.com/cat.png'
									}
								}
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
