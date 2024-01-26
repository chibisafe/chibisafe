import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import type { FileProps } from '~/types';

import { getFiles } from '@/lib/api';
import { Masonry } from '@/components/Masonry';

const fetchKey = (props: FileProps) => {
	const key = [];
	if (props.type === 'admin') {
		key.push('admin');

		if (props.userUuid) {
			key.push('user', props.userUuid);
		} else if (props.ip) {
			key.push('ip', props.ip);
		}
	}

	if (props.type === 'album') {
		key.push('album', props.albumUuid);
	} else if (props.type === 'publicAlbum') {
		key.push('publicAlbum', props.identifier);
	} else if (props.type === 'tag') {
		key.push('tag', props.tagUuid);
	} else {
		key.push('files');
	}

	// key.push({ page: page.value, limit: limit.value, anon: anon.value, search: search.value });
	return key;
};

// const getFiles = async (page?: 1, limit?: 50) => {
// 	try {
// 		const response = await fetch(`files?page=${page}&limit=${limit}`);
// 		return await response.json();
// 	} catch (error: any) {
// 		toast.error(error.message);
// 		return null;
// 	}
// };

const fetchEndpoint = async (props: FileProps) => {
	// if (search.value) {
	// 	return searchFiles(search.value, currentPage.value, currentLimit.value);
	// }
	// switch (props.type) {
	// 	case 'admin': {
	// 		if (props.userUuid) {
	// 			return getFilesFromUser(props.userUuid, currentPage.value, currentLimit.value);
	// 		} else if (props.ip) {
	// 			return getFilesFromIP(props.ip, currentPage.value, currentLimit.value);
	// 		} else {
	// 			return getFilesAdmin(currentPage.value, currentLimit.value, anonymous.value);
	// 		}
	// 	}
	// 	case 'quarantine':
	// 		return getFilesAdmin(currentPage.value, currentLimit.value, false, true);
	// 	case 'album':
	// 		return getAlbum(props.albumUuid!, currentPage.value);
	// 	case 'tag':
	// 		return getTag(props.tagUuid!, currentPage.value);
	// 	case 'publicAlbum':
	// 		return getFilesFromPublicAlbum(props.identifier!, currentPage.value, currentLimit.value);
	// 	case 'uploads':
	// 		return getFiles(currentPage.value, currentLimit.value);
	// 	default:
	// 		break;
	// }
	// return getFiles;
};

export async function FilesList(props: FileProps) {
	const keys = fetchKey(props);
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: keys,
		queryFn: () => getFiles()
	});

	return <HydrationBoundary state={dehydrate(queryClient)}>{<Masonry keys={keys} />}</HydrationBoundary>;
}
