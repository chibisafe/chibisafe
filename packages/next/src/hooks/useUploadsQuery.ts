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
	readonly type: FilePropsType;
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
		queryFn: () =>
			request.get(
				'files',
				{
					page: currentPage,
					limit: perPage,
					search
				},
				{},
				{
					next: {
						tags: ['files']
					}
				}
			)
	});
};
