import request from '@/lib/request';
import type { File, FilePropsType } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useUploadsQuery = ({
	currentPage,
	perPage,
	search = '',
	type,
	albumUuid
}: {
	readonly albumUuid?: string | undefined;
	readonly currentPage: number;
	readonly perPage: number;
	readonly search?: string;
	readonly type?: FilePropsType | undefined;
}) => {
	const isUploads = type === 'uploads';
	const isAlbumUploads = type === 'album' && Boolean(albumUuid);

	return useQuery<{ count: number; files: File[] }>({
		enabled: isUploads || isAlbumUploads,
		queryKey: isUploads
			? [
					'uploads',
					{
						currentPage,
						perPage,
						search
					}
				]
			: ['album', albumUuid, { currentPage, perPage, search }],
		queryFn: async () => {
			const {
				data: response,
				error,
				status
			} = await request.get({
				url: isUploads ? 'files' : `album/${albumUuid}`,
				query: {
					page: currentPage,
					limit: perPage,
					search
				}
			});

			if (error && status === 401) {
				throw new Error(error);
			}

			return response;
		}
	});
};
