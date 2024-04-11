import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { FileProps } from '@/types';

import request from './request';

export const fetchEndpoint = async (
	props: FileProps,
	currentPage: number,
	currentLimit: number,
	search = '',
	publicOnly = false
) => {
	const commonQuery = {
		page: currentPage,
		limit: currentLimit,
		search
	};

	const pageDataTag = [currentPage.toString(), currentLimit.toString()];

	if (props.type === 'publicAlbum') {
		return request.get({
			url: `album/${props.identifier}/view`,
			query: {
				...commonQuery
			},
			options: {
				cache: 'no-store',
				next: {
					tags: ['files', 'publicAlbum', props.identifier, ...pageDataTag]
				}
			}
		});
	}

	const cookiesStore = cookies();
	const token = cookiesStore.get('token')?.value;
	if (!token) redirect('/');

	const headers = {
		authorization: `Bearer ${token}`
	};

	if (props.query?.search) {
		return request.post({
			url: `files/search?page=${currentPage}&limit=${currentLimit}`,
			body: {
				text: props.query.search
			},
			options: {
				next: {
					tags: ['search', props.query.search, ...pageDataTag]
				}
			}
		});
	}

	switch (props.type) {
		case 'admin': {
			if (props.userUuid) {
				return request.get({
					url: `admin/user/${props.userUuid}/files`,
					query: {
						...commonQuery
					},
					headers,
					options: {
						next: {
							tags: ['files', 'user', props.userUuid?.toString(), ...pageDataTag]
						}
					}
				});
			} else if (props.ip) {
				return request.post({
					url: `admin/ip/files?page=${currentPage}&limit=${currentLimit}&search=${search}`,
					body: {
						ip: props.ip
					},
					headers,
					options: {
						next: {
							tags: ['files', 'ip', props.ip?.toString(), ...pageDataTag]
						}
					}
				});
			} else {
				return request.get({
					url: `admin/files`,
					query: {
						...commonQuery,
						publicOnly,
						quarantine: false
					},
					headers,
					options: {
						next: {
							tags: ['files', 'admin', ...pageDataTag]
						}
					}
				});
			}
		}

		case 'quarantine':
			return request.get({
				url: `admin/files`,
				query: {
					...commonQuery,
					publicOnly,
					quarantine: true
				},
				headers,
				options: {
					next: {
						tags: ['files', 'admin', 'quarantine', ...pageDataTag]
					}
				}
			});
		case 'album':
			return request.get({
				url: `album/${props.albumUuid!}`,
				query: {
					...commonQuery
				},
				headers,
				options: {
					next: {
						tags: ['files', 'album', props.albumUuid?.toString(), ...pageDataTag]
					}
				}
			});
		case 'tag':
			return request.get({
				url: `tag/${props.tagUuid}`,
				query: {
					...commonQuery
				},
				headers,
				options: {
					next: {
						tags: ['files', 'tag', props.tagUuid?.toString(), ...pageDataTag]
					}
				}
			});
		default:
			return request.get({
				url: 'files',
				query: {
					...commonQuery
				},
				headers,
				options: {
					next: {
						tags: ['files', ...pageDataTag]
					}
				}
			});
	}
};
