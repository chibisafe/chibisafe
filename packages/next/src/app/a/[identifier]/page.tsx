import type { Metadata } from 'next';
import type { PageQuery } from '@/types';

import { fetchEndpoint } from '@/lib/fileFetching';
import { DashboardHeader } from '@/components/DashboardHeader';
import { FilesList } from '@/components/FilesList';
import { FilesListNsfwToggle } from '@/components/FilesListNsfwToggle';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
	title: 'Public - Album'
};

export default async function PublicAlbumPage({
	searchParams,
	params
}: {
	readonly params: { identifier: string };
	readonly searchParams: PageQuery;
}) {
	const currentPage = searchParams.page ?? 1;
	const perPage = searchParams.limit ? (searchParams.limit > 50 ? 50 : searchParams.limit) : 50;
	const search = searchParams.search ?? '';

	const {
		data: response,
		error,
		status
	} = await fetchEndpoint({ type: 'publicAlbum', identifier: params.identifier }, currentPage, perPage, search);

	if (error && status === 401) {
		redirect('/login');
	}

	return (
		<>
			<DashboardHeader title={response.album.name} subtitle={response.album.description} />
			<div className="px-2 flex h-full flex-grow flex-col">
				<FilesListNsfwToggle nsfw={response.album.isNsfw}>
					<FilesList type="publicAlbum" files={response.album.files} count={response.album.count} />
				</FilesListNsfwToggle>
			</div>
		</>
	);
}
