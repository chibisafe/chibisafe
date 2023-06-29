export default {
	summary: 'Get invites',
	description: 'Get all created invites',
	tags: ['Invites'],
	response: {
		200: {
			type: 'object',
			properties: {
				message: { $ref: 'ResponseMessage' },
				invites: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							code: {
								type: 'string',
								description: 'The invite code.',
								example: '1453821d-aaf9-435c-8a51-e3f16f7d2ee5'
							},
							createdBy: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										description: 'The UUID of the user who created the invite',
										example: '1453821d-aaf9-435c-8a51-e3f16f7d2ee5'
									},
									username: {
										type: 'string',
										description: 'The username of the user who created the invite',
										example: 'admin'
									}
								}
							},
							used: {
								type: 'boolean',
								description: 'Whether the invite has been used.',
								example: true
							},
							usedBy: {
								type: 'object',
								properties: {
									uuid: {
										type: 'string',
										description: 'The UUID of the user who used the invite',
										example: '1453821d-aaf9-435c-8a51-e3f16f7d2ee5'
									},
									username: {
										type: 'string',
										description: 'The username of the user who used the invite',
										example: 'hanekawa'
									}
								}
							},
							createdAt: {
								type: 'string',
								description: 'The date the invite was created.',
								example: '2021-04-24T18:00:00.000Z'
							},
							editedAt: {
								type: 'string',
								description: 'The date the invite was used.',
								example: '2021-04-24T18:00:00.000Z'
							}
						}
					}
				}
			}
		},
		'4xx': { $ref: 'HTTP4xxError' },
		'5xx': { $ref: 'HTTP5xxError' }
	}
};
