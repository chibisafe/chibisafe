import type { Metadata } from 'next';
import { cookies } from 'next/headers';

import type { PageQuery } from '@/types';
import request from '@/lib/request';
import { DashboardHeader } from '@/components/DashboardHeader';
import { AlbumSettingsDialog } from '@/components/dialogs/AlbumSettingsDialog';
import { CreateAlbumDialog } from '@/components/dialogs/CreateAlbumDialog';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { Pagination } from '@/components/Pagination';
import { AlbumMasonry } from '@/components/AlbumMasonry';

export const metadata: Metadata = {
	title: 'Dashboard - Albums'
};

export default async function AlbumsPage({ searchParams }: { readonly searchParams: PageQuery }) {
	const cookiesStore = cookies();
	const token = cookiesStore.get('token')?.value;
	if (!token) redirect('/');

	const currentPage = searchParams.page ?? 1;
	const perPage = searchParams.limit ? (searchParams.limit > 50 ? 50 : searchParams.limit) : 50;
	const search = searchParams.search ?? '';

	// const queryClient = new QueryClient();

	// await queryClient.prefetchQuery({
	// 	queryKey: ['albums', { currentPage, perPage, search }],
	// 	queryFn: async () => fetchEndpoint({ type: 'albums' }, currentPage, perPage, search)
	// });

	const {
		data: response,
		error,
		status
	} = await request.get({
		url: `albums`,
		query: {
			page: currentPage,
			limit: perPage,
			search
		},
		headers: {
			authorization: `Bearer ${token}`
		},
		options: {
			next: {
				tags: ['albums']
			}
		}
	});

	if (error && status === 401) {
		redirect('/login');
	}

	return (
		<>
			<DashboardHeader title="Albums" subtitle="Manage and create albums">
				<CreateAlbumDialog />
			</DashboardHeader>
			<div className="grid gap-8 w-full">
				<Suspense>
					<Pagination itemsTotal={response?.count} />
				</Suspense>
				<AlbumMasonry albums={response?.albums} />
			</div>
			<AlbumSettingsDialog />
		</>
	);
}
