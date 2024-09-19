import type { Metadata } from 'next';
import type { PageQuery } from '@/types';

import { fetchEndpoint } from '@/lib/fileFetching';
import { redirect } from 'next/navigation';
import { Pagination } from '@/components/Pagination';
import { FilesWrapper } from '@/components/FilesWrapper';
import { FileDialog } from '@/components/dialogs/FileDialog';

export const metadata: Metadata = {
	title: 'Dashboard - Admin - Quarantine'
};

export default async function DashboardAdminQuarantinePage({ searchParams }: { readonly searchParams: PageQuery }) {
	const currentPage = searchParams.page ?? 1;
	const perPage = searchParams.limit ? (searchParams.limit > 50 ? 50 : searchParams.limit) : 50;
	const search = searchParams.search ?? '';

	const { data: response, error, status } = await fetchEndpoint({ type: 'quarantine' }, currentPage, perPage, search);
	if (error && status === 401) {
		redirect('/login');
	}

	return (
		<div className="px-2 w-full">
			<div className="grid gap-4">
				<Pagination itemsTotal={response.count} type="quarantine" />
				<FilesWrapper files={response.files} total={response.count} type="quarantine" />
				<Pagination itemsTotal={response.count} type="quarantine" />
				<FileDialog />
			</div>
		</div>
	);
}
