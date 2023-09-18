export default {
	summary: 'Get files',
	description: 'Gets all files from a specific IP',
	tags: ['Files', 'IP Management'],
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
			ip: {
				type: 'string',
				description: 'The ip you want to get the files from.'
			}
		},
		required: ['ip']
	},
	response: {
		200: {
			type: 'object',
			properties: {
				message: { $ref: 'ResponseMessage' },
				files: {
					type: 'array',
					items: {
						$ref: 'FilesAsAdmin'
					}
				},
				count: {
					type: 'number',
					description: 'The amount of files that exist.'
				},
				banned: {
					type: 'boolean',
					description: 'Whether or not the IP is banned.'
				}
			}
		},
		'4xx': { $ref: 'HTTP4xxError' },
		'5xx': { $ref: 'HTTP5xxError' }
	}
};
