export default {
	summary: 'Upload file',
	description: 'Uploads a file',
	tags: ['Files'],
	headers: {
		type: 'object',
		properties: {
			albumuuid: { type: 'string' },
			'chibi-chunk-number': { type: 'number' },
			'chibi-chunks-total': { type: 'number' },
			'chibi-uuid': { type: 'string' }
		}
	},
	body: {
		type: ['object', 'null'],
		properties: {
			size: {
				type: 'number',
				description: 'The size of the file.'
			},
			name: {
				type: 'string',
				description: 'The name of the file.'
			},
			contentType: {
				type: 'string',
				description: 'The content type of the file.'
			}
		}
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
					example: 'https://chibisafe.moe/ks2vjph2hkc.png'
				},
				identifier: {
					type: 'string',
					description: 'The identifier of the file.',
					example: 'ks2vjph2hkc.jpg'
				},
				publicUrl: {
					type: 'string',
					description: 'The public URL of the file.',
					example: 'https://s3.amazonaws.com/chibisafe/ks2vjph2hkc.jpg'
				}
			}
		},
		204: {
			title: '204',
			type: 'object',
			properties: {}
		},
		'4xx': { $ref: 'HTTP4xxError' },
		'5xx': { $ref: 'HTTP5xxError' }
	}
};
