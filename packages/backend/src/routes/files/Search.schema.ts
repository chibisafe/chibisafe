export default {
	summary: 'Search',
	description: 'Search all the files',
	tags: ['Files'],
	query: {
		type: 'object',
		properties: {
			page: { $ref: 'QueryPage' },
			limit: { $ref: 'QueryLimit' }
		}
	},
	body: {
		type: 'object',
		properties: {
			text: {
				type: 'string',
				description: 'The text you want to search within your files.'
			}
		},
		required: ['text']
	},
	response: {
		200: {
			type: 'object',
			properties: {
				message: { $ref: 'ResponseMessage' },
				files: {
					type: 'array',
					items: {
						$ref: 'FilesAsUser'
					}
				},
				count: {
					type: 'number',
					description: 'The amount of files that exist.'
				}
			}
		},
		'4xx': { $ref: 'HTTP4xxError' },
		'5xx': { $ref: 'HTTP5xxError' }
	}
};
