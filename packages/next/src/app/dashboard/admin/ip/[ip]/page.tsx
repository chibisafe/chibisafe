import type { Metadata } from 'next';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DashboardHeader } from '@/components/DashboardHeader';
import { fetchEndpoint } from '@/lib/fileFetching';
import type { PageQuery } from '@/types';
import { FilesList } from '@/components/FilesList';

export const metadata: Metadata = {
	title: 'Dashboard - Admin - IPs'
};

export default async function DashboardPage({
	params,
	searchParams
}: {
	params: { ip: string };
	searchParams: PageQuery;
}) {
	const currentPage = searchParams.page ?? 1;
	const perPage = searchParams.limit ? (searchParams.limit > 50 ? 50 : searchParams.limit) : 50;

	// TODO: Fetching is broken, I believe it's the backend that's broken
	const response = await fetchEndpoint({ type: 'admin', ip: params.ip }, currentPage, perPage);
	return (
		<>
			<DashboardHeader title={`${params.ip} files`} subtitle="As an admin, you can manage their files">
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Ban this IP
				</Button>
			</DashboardHeader>
			<div className="px-2">
				<FilesList type="admin" files={response.files} count={response.count} />
			</div>
		</>
	);
}
