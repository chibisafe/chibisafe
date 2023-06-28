export default {
	summary: 'Save settings',
	description: 'Save the chibisafe instance settings',
	tags: ['Server'],
	body: {
		type: 'object',
		properties: {
			settings: {
				type: 'array',
				description: 'Items to save in the settings.',
				items: {
					type: 'object',
					properties: {
						key: { type: 'string', description: 'The key of the setting.' },
						value: { type: 'string', description: 'The value of the setting.' },
						type: { type: 'string', description: 'The type of the setting.' }
					}
				}
			}
		}
	},
	response: {
		200: {
			type: 'object',
			properties: {
				message: { $ref: 'ResponseMessage' }
			}
		},
		'4xx': { $ref: 'HTTP4xxError' },
		'5xx': { $ref: 'HTTP5xxError' }
	}
};
