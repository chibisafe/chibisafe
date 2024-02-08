import { cookies } from 'next/headers';
import type { Album as AlbumType, PageQuery } from '@/types';

import request from '@/lib/request';
import { Album } from '@/components/Album';
import { DashboardHeader } from '@/components/DashboardHeader';
import { CreateAlbumDialog } from '@/components/dialogs/CreateAlbumDialog';

export const metadata = {
	title: 'Dashboard - Albums'
};

export default async function AlbumsPage({ searchParams }: { searchParams: PageQuery }) {
	const cookiesStore = cookies();
	const token = cookiesStore.get('token')?.value;

	const response = await request.get(
		`albums`,
		{},
		{
			authorization: `Bearer ${token}`
		},
		{
			next: {
				tags: ['albums']
			}
		}
	);

	const albums = response.albums;

	return (
		<>
			<DashboardHeader title="Albums" subtitle="Manage and create albums">
				<CreateAlbumDialog />
			</DashboardHeader>
			<div className="px-2">
				<div className="flex flex-wrap gap-6 px-4">
					{albums.map((album: AlbumType) => (
						<Album key={album.uuid} album={album} />
					))}
				</div>
			</div>
		</>
	);
}
