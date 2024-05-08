import type { Metadata } from 'next';
import type { PageQuery } from '@/types';
import { Plus } from 'lucide-react';

import { fetchEndpoint } from '@/lib/fileFetching';
import { Button } from '@/components/ui/react-aria-button';
import { DashboardHeader } from '@/components/DashboardHeader';
import { GlobalDropZone } from '@/components/Dropzone';
import { UploadTrigger } from '@/components/UploadTrigger';
import { buttonVariants } from '@/styles/button';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { Pagination } from '@/components/Pagination';
import { FilesWrapper } from '@/components/FilesWrapper';
import { FileDialog } from '@/components/dialogs/FileDialog';

export const metadata: Metadata = {
	title: 'Dashboard - Albums'
};

export default async function AlbumPage({
	searchParams,
	params
}: {
	readonly params: { uuid: string };
	readonly searchParams: PageQuery;
}) {
	const currentPage = searchParams.page ?? 1;
	const perPage = searchParams.limit ? (searchParams.limit > 50 ? 50 : searchParams.limit) : 50;
	const search = searchParams.search ?? '';

	const {
		data: response,
		error,
		status
	} = await fetchEndpoint({ type: 'album', albumUuid: params.uuid }, currentPage, perPage);
	if (error && status === 401) {
		redirect('/login');
	}

	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ['album', params.uuid, { currentPage, perPage, search }],
		queryFn: async () => {
			const { data: response } = await fetchEndpoint(
				{ type: 'album', albumUuid: params.uuid },
				currentPage,
				perPage,
				search
			);
			return response;
		}
	});

	return (
		<>
			<DashboardHeader
				title={response.name}
				subtitle={response.description}
				breadcrumbs={[
					{ name: 'Albums', url: '/dashboard/albums' },
					{ name: response.name, url: `/dashboard/albums/${params.uuid}` }
				]}
			>
				<UploadTrigger allowsMultiple albumUuid={params.uuid}>
					<Button className={buttonVariants()}>
						<Plus className="mr-2 h-4 w-4" />
						Upload file to album
					</Button>
				</UploadTrigger>
			</DashboardHeader>
			<div className="px-2 w-full">
				<HydrationBoundary state={dehydrate(queryClient)}>
					<div className="grid gap-4">
						<Suspense>
							<Pagination type="album" albumUuid={params.uuid} />
							<FilesWrapper type="album" albumUuid={params.uuid} />
							<Pagination type="album" albumUuid={params.uuid} />
						</Suspense>
						<FileDialog />
					</div>
				</HydrationBoundary>
			</div>
			<GlobalDropZone albumUuid={params.uuid} />
		</>
	);
}
