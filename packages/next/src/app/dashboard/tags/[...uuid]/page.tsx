import type { Metadata } from 'next';
import type { PageQuery } from '@/types';
import { Plus } from 'lucide-react';

import { fetchEndpoint } from '@/lib/fileFetching';
import { Button } from '@/components/ui/button';
import { DashboardHeader } from '@/components/DashboardHeader';
import { FilesList } from '@/components/FilesList';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
	title: 'Dashboard - Tags'
};

export default async function TagPage({
	searchParams,
	params
}: {
	readonly params: { uuid: string };
	readonly searchParams: PageQuery;
}) {
	const currentPage = searchParams.page ?? 1;
	const perPage = searchParams.limit ? (searchParams.limit > 50 ? 50 : searchParams.limit) : 50;

	const {
		data: response,
		error,
		status
	} = await fetchEndpoint({ type: 'tag', tagUuid: params.uuid }, currentPage, perPage);
	if (error && status === 401) {
		redirect('/login');
	}

	return (
		<>
			<DashboardHeader
				title={response.name}
				subtitle={response.description}
				breadcrumbs={[
					{ name: 'Tags', url: '/dashboard/tags' },
					{ name: response.name, url: `/dashboard/tags/${params.uuid}` }
				]}
			>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Upload file
				</Button>
			</DashboardHeader>
			<div className="px-2">
				<FilesList type="tag" files={response.files} count={response.count} />
			</div>
		</>
	);
}
