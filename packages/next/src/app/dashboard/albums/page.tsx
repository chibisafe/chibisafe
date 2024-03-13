import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import type { Album as AlbumType, PageQuery } from '@/types';

import request from '@/lib/request';
import { Album } from '@/components/Album';
import { DashboardHeader } from '@/components/DashboardHeader';
import { AlbumSettingsDialog } from '@/components/dialogs/AlbumSettingsDialog';
import { CreateAlbumDialog } from '@/components/dialogs/CreateAlbumDialog';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { Pagination } from '@/components/Pagination';

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
	} = await request.get(
		`albums`,
		{
			page: currentPage,
			limit: perPage,
			search
		},
		{
			authorization: `Bearer ${token}`
		},
		{
			next: {
				tags: ['albums']
			}
		}
	);

	if (error && status === 401) {
		redirect('/login');
	}

	return (
		<>
			<DashboardHeader title="Albums" subtitle="Manage and create albums">
				<CreateAlbumDialog />
			</DashboardHeader>
			<div className="px-2">
				<Suspense>
					<Pagination itemsTotal={response.count} />
				</Suspense>
				<div className="flex flex-wrap gap-6 px-4 mt-8">
					{response.albums.map((album: AlbumType) => (
						<Album key={album.uuid} album={album} />
					))}
				</div>
			</div>
			<AlbumSettingsDialog />
		</>
	);
}
