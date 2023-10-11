export default {
	summary: 'Get tags',
	description: 'Return a list of tags belonging to the user',
	tags: ['Tags'],
	response: {
		200: {
			type: 'object',
			properties: {
				message: { $ref: 'ResponseMessage' },
				tags: {
					type: 'array',
					description: 'An array of tags belonging to the user.',
					items: {
						type: 'object',
						properties: {
							uuid: {
								type: 'string',
								description: 'The UUID of the tag.',
								example: '1453821d-aaf9-435c-8a51-e3f16f7d2ee5'
							},
							name: {
								type: 'string',
								description: 'The name of the tag.',
								example: 'Good Stuff'
							},
							_count: {
								type: 'object',
								description: 'The number of files belonging to the tag.',
								properties: {
									files: {
										type: 'number',
										description: 'The number of files belonging to the tag.',
										example: 3
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
