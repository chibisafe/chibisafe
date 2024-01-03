export default {
	summary: 'Get settings',
	description: 'Returns the chibisafe instance settings',
	tags: ['Server'],
	response: {
		200: {
			type: 'object',
			properties: {
				settings: {
					type: 'array',
					description: 'All the chibisafe instance settings.',
					items: {
						type: 'object',
						properties: {
							name: { type: 'string', description: 'The name of the setting.' },
							key: { type: 'string', description: 'The key of the setting.' },
							value: {
								type: ['string', 'number', 'boolean', 'array'],
								description: 'The value of the setting.'
							},
							type: { type: 'string', description: 'The type of the setting.' },
							description: { type: 'string', description: 'The description of the setting.' },
							notice: { type: 'string', description: 'The notice of the setting, if any.' },
							example: { type: 'string', description: 'An example value of the setting.' },
							category: { type: 'string', description: 'The category of the setting.' }
						}
					}
				}
			}
		},
		'4xx': { $ref: 'HTTP4xxError' },
		'5xx': { $ref: 'HTTP5xxError' }
	}
};
