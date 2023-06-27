export default {
	description: 'Returns the chibisafe instance settings.',
	tags: ['Admin', 'Server'],
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
							value: {
								type: ['string', 'number', 'boolean', 'array'],
								description: 'The value of the setting.'
							},
							type: { type: 'string', description: 'The type of the setting.' }
						}
					}
				}
			}
		},
		'4xx': { $ref: 'HTTP4xxError' },
		'5xx': { $ref: 'HTTP5xxError' }
	}
};
