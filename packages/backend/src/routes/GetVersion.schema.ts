export default {
	summary: 'Get version',
	description: 'Get the current version of the application',
	tags: ['Server'],
	response: {
		200: {
			type: 'object',
			properties: {
				version: {
					type: 'string',
					description: 'The current version of the application.',
					example: '1.0.0'
				}
			}
		}
	}
};
