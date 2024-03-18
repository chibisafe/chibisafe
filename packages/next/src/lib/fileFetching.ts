import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { FileProps } from '@/types';

import request from './request';

export const fetchEndpoint = async (props: FileProps, currentPage: number, currentLimit: number, search = '') => {
	const publicOnly = false;

	const cookiesStore = cookies();
	const token = cookiesStore.get('token')?.value;
	if (!token) redirect('/');

	const headers = {
		authorization: `Bearer ${token}`
	};

	const commonQuery = {
		page: currentPage,
		limit: currentLimit,
		search
	};

	if (props.query?.search) {
		return request.post({
			url: `files/search?page=${currentPage}&limit=${currentLimit}`,
			body: {
				text: props.query?.search
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
							tags: ['files']
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
							tags: ['files']
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
							tags: ['files']
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
						tags: ['files']
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
						tags: ['files']
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
						tags: ['files']
					}
				}
			});
		case 'publicAlbum':
			return request.get({
				url: `album/${props.identifier}/view`,
				query: {
					...commonQuery
				},
				headers,
				options: {
					next: {
						tags: ['files']
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
						tags: ['files']
					}
				}
			});
	}
};
