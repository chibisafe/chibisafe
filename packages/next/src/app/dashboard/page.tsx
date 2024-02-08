import type { PageQuery } from '@/types';
import { Plus } from 'lucide-react';

import { fetchEndpoint } from '@/lib/fileFetching';
import { Button } from '@/components/ui/button';
import { DashboardHeader } from '@/components/DashboardHeader';
import { FilesList } from '@/components/FilesList';

export const metadata = {
	title: 'Dashboard - Uploads'
};

export default async function DashboardPage({ searchParams }: { searchParams: PageQuery }) {
	const currentPage = searchParams.page ?? 1;
	const perPage = searchParams.limit ? (searchParams.limit > 50 ? 50 : searchParams.limit) : 50;

	const response = await fetchEndpoint({ type: 'uploads' }, currentPage, perPage);

	return (
		<>
			<DashboardHeader title="Uploads" subtitle="Manage your uploads">
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Upload file
				</Button>
			</DashboardHeader>
			<div className="px-2">
				<FilesList type="uploads" files={response.files} count={response.count} />
			</div>
		</>
	);
}
