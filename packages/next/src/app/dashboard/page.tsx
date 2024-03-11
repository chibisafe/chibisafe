import type { Metadata } from 'next';
import type { PageQuery } from '@/types';
import { Plus } from 'lucide-react';

import { fetchEndpoint } from '@/lib/fileFetching';
import { Button } from '@/components/ui/button';
import { DashboardHeader } from '@/components/DashboardHeader';
import { FilesList } from '@/components/FilesList';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';

export const metadata: Metadata = {
	title: 'Dashboard - Uploads'
};

export default async function DashboardPage({ searchParams }: { readonly searchParams: PageQuery }) {
	const currentPage = searchParams.page ?? 1;
	const perPage = searchParams.limit ? (searchParams.limit > 50 ? 50 : searchParams.limit) : 50;
	const search = searchParams.search ?? '';

	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ['uploads', { currentPage, perPage, search }],
		queryFn: () => fetchEndpoint({ type: 'uploads' }, currentPage, perPage, search)
	});

	// const response = await fetchEndpoint({ type: 'uploads' }, currentPage, perPage, search);

	return (
		<>
			<DashboardHeader title="Uploads" subtitle="Manage your uploads">
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Upload file
				</Button>
			</DashboardHeader>
			<div className="px-2">
				<HydrationBoundary state={dehydrate(queryClient)}>
					<FilesList type="uploads" />
				</HydrationBoundary>
			</div>
		</>
	);
}
