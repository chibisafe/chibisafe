export default {
	$id: 'UserAsAdmin',
	type: 'object',
	description: 'The user object.',
	properties: {
		uuid: {
			type: 'string',
			description: "The user's UUID.",
			example: '1453821d-aaf9-435c-8a51-e3f16f7d2ee5'
		},
		username: {
			type: 'string',
			description: "The user's username.",
			example: 'admin'
		},
		roles: {
			type: 'array',
			description: "The user's roles.",
			items: {
				type: 'object',
				properties: {
					name: {
						type: 'string',
						description: "The role's name.",
						example: 'admin'
					}
				}
			}
		},
		enabled: {
			type: 'boolean',
			description: "Whether the user's account is enabled or not.",
			example: true
		},
		createdAt: {
			type: 'string',
			description: "The user's creation date.",
			example: '2021-01-01T00:00:00.000Z'
		},
		editedAt: {
			type: 'string',
			description: "The user's last edit date.",
			example: '2021-01-01T00:00:00.000Z'
		}
	}
};
