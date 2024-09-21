import type { Metadata } from 'next';
import type { PageQuery } from '@/types';

import { GlobalDropZone } from '@/components/Dropzone';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { Pagination } from '@/components/Pagination';
import { FilesWrapper } from '@/components/FilesWrapper';
import { FileDialog } from '@/components/dialogs/FileDialog';
import { openAPIClient } from '@/lib/serverFetch';

export const metadata: Metadata = {
	title: 'Dashboard - Album - Settings'
};

export default async function AlbumSettingsPage({ params }: { readonly params: { uuid: string } }) {
	// const queryClient = new QueryClient();

	// await queryClient.prefetchQuery({
	// 	queryKey: ['album', params.uuid, 'share'],
	// 	queryFn: async () => {
	// 		const { data } = await openAPIClient.GET('/api/v1/folders/{uuid}/share/', {
	// 			params: {
	// 				path: {
	// 					uuid: params.uuid
	// 				}
	// 			}
	// 		});

	// 		return data;
	// 	}
	// });

	return (
		<>
			WIP
			{/* <div className="px-2 w-full">
				<HydrationBoundary state={dehydrate(queryClient)}>
					<div className="grid gap-4">
						<Pagination type="album" albumUuid={params.uuid} />
						<FilesWrapper type="album" albumUuid={params.uuid} />
						<Pagination type="album" albumUuid={params.uuid} />
						<FileDialog />
					</div>
				</HydrationBoundary>
			</div>
			<GlobalDropZone albumUuid={params.uuid} /> */}
		</>
	);
}
