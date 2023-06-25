export default {
	description: 'Gets the content of an album.',
	tags: ['Albums', 'API Key'],
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
				data: {
					type: 'object',
					properties: {
						identifier: { type: 'string' },
						uuid: { type: 'string' },
						albumId: { type: 'string' },
						enabled: { type: 'boolean' },
						enableDownload: { type: 'boolean' },
						expiresAt: { type: 'string' },
						views: { type: 'number' },
						files: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									name: { type: 'string', description: 'The name of the file.', example: 'cat.png' },
									createdAt: {
										type: 'string',
										description: 'The date the file was uploaded.',
										example: '2021-01-01T00:00:00.000Z'
									},
									ip: {
										type: 'string',
										description: 'The IP address of the uploader.',
										example: '1.1.1.1'
									},
									original: {
										type: 'string',
										description: 'The original name of the file.',
										example: 'cat.png'
									},
									uuid: {
										type: 'string',
										description: 'The uuid of the file.',
										example: '1453821d-aaf9-435c-8a51-e3f16f7d2ee5'
									},
									hash: {
										type: 'string',
										description: 'The hash of the file.',
										example: 'd41d8cd98f00b204e9800998ecf8427e'
									},
									size: {
										type: 'number',
										description: 'The size of the file in bytes.',
										example: 123456
									},

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
