export default {
	$id: 'RequestUser',
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
		apiKey: {
			type: 'string',
			description: "The user's API key.",
			example: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'
		},
		passwordEditedAt: {
			type: 'string',
			description: "The date and time the user's password was last edited.",
			example: '2021-01-01T00:00:00.000Z'
		}
	}
};
