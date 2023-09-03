export default {
	$id: 'StorageQuota',
	type: 'object',
	description: "The user's storage quota.",
	properties: {
		used: {
			type: 'number',
			description: "The user's used storage space.",
			example: '14538214'
		},
		quota: {
			type: 'number',
			description: "The user's storage quota.",
			example: '100000000'
		},
		overQuota: {
			type: 'boolean',
			description: 'Whether the user is over quota.',
			example: 'false'
		}
	}
};
