export default {
	summary: 'Get banned IPs',
	description: 'Gets all the banned IPs',
	tags: ['IP Management'],
	response: {
		200: {
			type: 'array',
			items: {
				ip: 'string',
				createdAt: 'string'
			}
		},
		'4xx': { $ref: 'HTTP4xxError' },
		'5xx': { $ref: 'HTTP5xxError' }
	}
};
