import type { PageQuery } from '@/types';
import { Plus } from 'lucide-react';

import { fetchEndpoint } from '@/lib/fileFetching';
import { Button } from '@/components/ui/button';
import { DashboardHeader } from '@/components/DashboardHeader';
import { FilesList } from '@/components/FilesList';

export const metadata = {
	title: 'Dashboard - Albums'
};

export default async function AlbumPage({
	searchParams,
	params
}: {
	params: { uuid: string };
	searchParams: PageQuery;
}) {
	const currentPage = searchParams.page ?? 1;
	const perPage = searchParams.limit ? (searchParams.limit > 50 ? 50 : searchParams.limit) : 50;

	const response = await fetchEndpoint({ type: 'album', albumUuid: params.uuid }, currentPage, perPage);
	console.log(response);
	// TODO: Modify the response to include the album name and subtitle
	return (
		<>
			<DashboardHeader title={response.name} subtitle={response.description}>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Upload file to album
				</Button>
			</DashboardHeader>
			<div className="px-2">
				<FilesList type="album" files={response.files} count={response.count} />
			</div>
		</>
	);
}
