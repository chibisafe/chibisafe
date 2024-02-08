import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { FileProps } from '@/types';

import { searchFiles } from './api';
import request from './request';

export const fetchEndpoint = async (props: FileProps, currentPage: number, currentLimit: number) => {
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
						limit: currentLimit
					},
					authorization
				);
			} else if (props.ip) {
				// TODO: Update backend to accept this URL type
				return request.get(
					`admin/files/ip/${props.ip}`,
					{
						page: currentPage,
						limit: currentLimit
					},
					authorization
				);
			} else {
				return request.get(
					`admin/files`,
					{
						page: currentPage,
						limit: currentLimit,
						publicOnly,
						quarantine: false
					},
					authorization
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
					quarantine: true
				},
				authorization
			);
		case 'album':
			return request.get(
				`album/${props.albumUuid!}`,
				{
					page: currentPage,
					limit: currentLimit
				},
				authorization
			);
		case 'tag':
			return request.get(
				`tag/${props.tagUuid}`,
				{
					page: currentPage,
					limit: currentLimit
				},
				authorization
			);
		case 'publicAlbum':
			return request.get(
				`album/${props.identifier}/view`,
				{
					page: currentPage,
					limit: currentLimit
				},
				authorization
			);
		default:
			return request.get(
				'files',
				{
					page: currentPage,
					limit: currentLimit
				},
				authorization
			);
	}
};
