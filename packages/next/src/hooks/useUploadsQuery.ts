import request from '@/lib/request';
import type { File, FilePropsType } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useUploadsQuery = ({
	currentPage,
	perPage,
	search = '',
	type
}: {
	readonly currentPage: number;
	readonly perPage: number;
	readonly search?: string;
	readonly type?: FilePropsType | undefined;
}) => {
	return useQuery<{ count: number; files: File[] }>({
		enabled: type === 'uploads',
		queryKey: [
			'uploads',
			{
				currentPage,
				perPage,
				search
			}
		],
		queryFn: async () => {
			const {
				data: response,
				error,
				status
			} = await request.get({
				url: 'files',
				query: {
					page: currentPage,
					limit: perPage,
					search
				},
				options: {
					next: {
						tags: ['files']
					}
				}
			});

			if (error && status === 401) {
				throw new Error(error);
			}

			return response;
		}
	});
};
