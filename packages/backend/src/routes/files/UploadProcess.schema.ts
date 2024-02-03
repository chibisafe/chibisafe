export default {
	summary: 'Process uploaded file',
	description: 'Processes an uploaded file',
	tags: ['Files'],
	headers: {
		type: 'object',
		properties: {
			albumuuid: { type: 'string' }
		}
	},
	body: {
		type: 'object',
		properties: {
			identifier: {
				type: 'string',
				description: 'The identifier of the file.'
			},
			name: {
				type: 'string',
				description: 'The name of the file.'
			},
			type: {
				type: 'string',
				description: 'The type of the file.'
			}
		},
		required: ['identifier', 'name', 'type']
	},
	response: {
		200: {
			type: 'object',
			properties: {
				name: {
					type: 'string',
					description: 'The name of the file.',
					example: '31105617_p0.png'
				},
				uuid: {
					type: 'string',
					description: 'The UUID of the file.',
					example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6'
				},
				url: {
					type: 'string',
					description: 'The URL of the file.',
					example: 'https://s3.amazonaws.com/chibisafe/ks2vjph2hkc.jpg'
				},
				identifier: {
					type: 'string',
					description: 'The identifier of the file.',
					example: 'ks2vjph2hkc.jpg'
				}
			}
		},
		'4xx': { $ref: 'HTTP4xxError' },
		'5xx': { $ref: 'HTTP5xxError' }
	}
};
