import { cookies } from 'next/headers';
import type { FileProps } from '@/types';

import {
	getAlbum,
	getFiles,
	getFilesAdmin,
	getFilesFromIP,
	getFilesFromPublicAlbum,
	getFilesFromUser,
	getTag,
	searchFiles
} from '@/lib/api';
import { Masonry } from '@/components/Masonry';
import { Pagination } from '@/components/Pagination';

const fetchEndpoint = (props: FileProps, currentPage: number, currentLimit: number) => {
	console.log('Fetching files', props);
	const anonymous = false;

	const cookiesStore = cookies();
	const token = cookiesStore.get('token')?.value;
	// TODO: Handle failure of not having a cookie

	if (props.query?.search) {
		return searchFiles(props.query?.search, currentPage, currentLimit);
	}

	switch (props.type) {
		case 'admin': {
			if (props.userUuid) {
				return getFilesFromUser(props.userUuid, currentPage, currentLimit);
			} else if (props.ip) {
				return getFilesFromIP(props.ip, currentPage, currentLimit);
			} else {
				return getFilesAdmin(currentPage, currentLimit, anonymous);
			}
		}

		case 'quarantine':
			return getFilesAdmin(currentPage, currentLimit, false, true);
		case 'album':
			return getAlbum(props.albumUuid!, currentPage);
		case 'tag':
			return getTag(props.tagUuid!, currentPage);
		case 'publicAlbum':
			return getFilesFromPublicAlbum(props.identifier!, currentPage, currentLimit);
		default:
			return getFiles({
				page: currentPage,
				limit: currentLimit,
				headers: {
					authorization: `Bearer ${token}`
				}
			});
	}
};

export async function FilesList(props: FileProps) {
	const currentPage = props.query?.page || 1;
	const perPage = props.query?.limit ? (props.query.limit > 50 ? 50 : props.query.limit) : 50;

	const response = await fetchEndpoint(props, currentPage, perPage);
	return (
		<div className="grid gap-8">
			<Pagination currentPage={currentPage} perPage={perPage} itemsTotal={response.count} />
			<Masonry files={response.files} total={response.count} type={props.type} />
		</div>
	);
}
