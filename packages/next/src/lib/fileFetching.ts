import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { FileProps } from '@/types';

import { searchFiles } from './api';
import request from './request';

export const fetchEndpoint = async (props: FileProps, currentPage: number, currentLimit: number, search = '') => {
	const publicOnly = false;

	const cookiesStore = cookies();
	const token = cookiesStore.get('token')?.value;
	if (!token) redirect('/');

	const authorization = {
		authorization: `Bearer ${token}`
	};

	if (props.query?.search) {
		return searchFiles(props.query?.search, currentPage, currentLimit);
	}

	switch (props.type) {
		case 'admin': {
			if (props.userUuid) {
				return request.get(
					`admin/user/${props.userUuid}/files`,
					{
						page: currentPage,
						limit: currentLimit,
						search
					},
					authorization,
					{
						next: {
							tags: ['files']
						}
					}
				);
			} else if (props.ip) {
				return request.post(
					`admin/ip/files?page=${currentPage}&limit=${currentLimit}&search=${search}`,
					{
						ip: props.ip
					},
					authorization,
					{
						next: {
							tags: ['files']
						}
					}
				);
			} else {
				return request.get(
					`admin/files`,
					{
						page: currentPage,
						limit: currentLimit,
						publicOnly,
						quarantine: false,
						search
					},
					authorization,
					{
						next: {
							tags: ['files']
						}
					}
				);
			}
		}

		case 'quarantine':
			return request.get(
				`admin/files`,
				{
					page: currentPage,
					limit: currentLimit,
					publicOnly,
					quarantine: true,
					search
				},
				authorization,
				{
					next: {
						tags: ['files']
					}
				}
			);
		case 'album':
			return request.get(
				`album/${props.albumUuid!}`,
				{
					page: currentPage,
					limit: currentLimit,
					search
				},
				authorization,
				{
					next: {
						tags: ['files']
					}
				}
			);
		case 'tag':
			return request.get(
				`tag/${props.tagUuid}`,
				{
					page: currentPage,
					limit: currentLimit,
					search
				},
				authorization,
				{
					next: {
						tags: ['files']
					}
				}
			);
		case 'publicAlbum':
			return request.get(
				`album/${props.identifier}/view`,
				{
					page: currentPage,
					limit: currentLimit,
					search
				},
				authorization,
				{
					next: {
						tags: ['files']
					}
				}
			);
		default:
			return request.get(
				'files',
				{
					page: currentPage,
					limit: currentLimit,
					search
				},
				authorization,
				{
					next: {
						tags: ['files']
					}
				}
			);
	}
};
