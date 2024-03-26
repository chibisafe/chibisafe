import type { Metadata } from 'next';
import type { PageQuery } from '@/types';

import { fetchEndpoint } from '@/lib/fileFetching';
import { DashboardHeader } from '@/components/DashboardHeader';
import { FilesList } from '@/components/FilesList';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
	title: 'Dashboard - Admin - Files'
};

export default async function AdminFilesPage({ searchParams }: { readonly searchParams: PageQuery }) {
	const currentPage = searchParams.page ?? 1;
	const perPage = searchParams.limit ? (searchParams.limit > 50 ? 50 : searchParams.limit) : 50;
	const search = searchParams.search ?? '';

	const { data: response, error, status } = await fetchEndpoint({ type: 'admin' }, currentPage, perPage, search);
	if (error && status === 401) {
		redirect('/login');
	}

	return (
		<>
			<DashboardHeader
				title="Everyone's files"
				subtitle="Manage all of chibisafe files, no matter who owns them."
				breadcrumbs={[
					{ name: 'Admin', url: '/dashboard/admin' },
					{ name: 'All files', url: '/dashboard/admin/files' }
				]}
			/>
			<div className="px-2 w-full">
				<FilesList type="admin" files={response.files} count={response.count} />
			</div>
		</>
	);
}
