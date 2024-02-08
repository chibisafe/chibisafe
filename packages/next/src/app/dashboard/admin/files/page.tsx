import type { PageQuery } from '@/types';

import { fetchEndpoint } from '@/lib/fileFetching';
import { DashboardHeader } from '@/components/DashboardHeader';
import { FilesList } from '@/components/FilesList';

export const metadata = {
	title: 'Dashboard - Admin - Files'
};

export default async function AdminFilesPage({ searchParams }: { searchParams: PageQuery }) {
	const currentPage = searchParams.page ?? 1;
	const perPage = searchParams.limit ? (searchParams.limit > 50 ? 50 : searchParams.limit) : 50;

	const response = await fetchEndpoint({ type: 'admin' }, currentPage, perPage);
	return (
		<>
			<DashboardHeader title="Files" subtitle="Manage all of chibisafe files" />
			<div className="px-2">
				<FilesList type="admin" files={response.files} count={response.count} />
			</div>
		</>
	);
}
