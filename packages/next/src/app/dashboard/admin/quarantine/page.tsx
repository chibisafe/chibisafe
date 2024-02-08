import type { PageQuery } from '@/types';

import { fetchEndpoint } from '@/lib/fileFetching';
import { DashboardHeader } from '@/components/DashboardHeader';
import { FilesList } from '@/components/FilesList';

export const metadata = {
	title: 'Dashboard - Admin - Quarantine'
};

export default async function DashboardPage({ searchParams }: { searchParams: PageQuery }) {
	const currentPage = searchParams.page ?? 1;
	const perPage = searchParams.limit ? (searchParams.limit > 50 ? 50 : searchParams.limit) : 50;

	const response = await fetchEndpoint({ type: 'quarantine' }, currentPage, perPage);

	return (
		<>
			<DashboardHeader title="Quarantined files" subtitle="Manage quarantined files" />
			<div className="px-2">
				<FilesList type="quarantine" files={response.files} count={response.count} />
			</div>
		</>
	);
}
