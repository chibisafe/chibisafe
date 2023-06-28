export default {
	summary: 'Get file',
	description: 'Gets a file as admin',
	tags: ['Files'],
	params: {
		type: 'object',
		properties: {
			uuid: {
				type: 'string',
				description: 'The uuid of the file.'
			}
		},
		required: ['uuid']
	},
	response: {
		200: {
			type: 'object',
			properties: {
				message: { $ref: 'ResponseMessage' },
				file: { $ref: 'FilesAsUser' },
				user: { $ref: 'UserAsAdmin' }
			}
		},
		'4xx': { $ref: 'HTTP4xxError' },
		'5xx': { $ref: 'HTTP5xxError' }
	}
};
