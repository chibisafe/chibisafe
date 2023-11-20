export default {
	summary: 'Get tag',
	description: 'Gets the content of an tag',
	tags: ['Tags'],
	params: {
		type: 'object',
		properties: {
			uuid: {
				type: 'string',
				description: 'The uuid of the tag.'
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
				name: { type: 'string', description: 'The name of the tag.', example: 'Cats' },
				count: { type: 'number', description: 'The number of files in the tag.', example: 1 },
				files: {
					type: 'array',
					items: {
						$ref: 'FilesAsUser'
					}
				}
			}
		},
		'4xx': { $ref: 'HTTP4xxError' },
		'5xx': { $ref: 'HTTP5xxError' }
	}
};
