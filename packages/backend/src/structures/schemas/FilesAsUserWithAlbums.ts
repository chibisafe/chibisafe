import FilesAsUser from './FilesAsUser.js';

export default {
	$id: 'FilesAsUserWithAlbums',
	type: 'object',
	description: 'The file object.',
	properties: {
		...FilesAsUser.properties,
		albums: {
			type: 'array',
			description: 'The albums the file is in.',
			items: {
				type: 'object',
				properties: {
					uuid: {
						type: 'string',
						description: 'The uuid of the album.',
						example: '1453821d-aaf9-435c-8a51-e3f16f7d2ee5'
					},
					name: {
						type: 'string',
						description: 'The name of the album.',
						example: 'Cats'
					}
				}
			}
		},
		tags: {
			type: 'array',
			description: 'The tags of the file.',
			items: {
				type: 'object',
				properties: {
					uuid: {
						type: 'string',
						description: 'The uuid of the tag.',
						example: '1453821d-aaf9-435c-8a51-e3f16f7d2ee5'
					},
					name: {
						type: 'string',
						description: 'The name of the tag.',
						example: 'Cats'
					}
				}
			}
		}
	}
};
