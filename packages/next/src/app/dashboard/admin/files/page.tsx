import type { Metadata } from 'next';
import type { PageQuery } from '@/types';

import { fetchEndpoint } from '@/lib/fileFetching';
import { redirect } from 'next/navigation';
import { Pagination } from '@/components/Pagination';
import { FilesWrapper } from '@/components/FilesWrapper';
import { FileDialog } from '@/components/dialogs/FileDialog';

export const metadata: Metadata = {
	title: 'Dashboard - Admin - Files'
};

export default async function AdminFilesPage({ searchParams }: { readonly searchParams: PageQuery }) {
	const currentPage = searchParams.page ?? 1;
	const perPage = searchParams.limit ? (searchParams.limit > 50 ? 50 : searchParams.limit) : 50;
	const search = searchParams.search ?? '';
	const publicOnly = searchParams.publicOnly ?? false;

	const {
		data: response,
		error,
		status
	} = await fetchEndpoint({ type: 'admin' }, currentPage, perPage, search, publicOnly);
	if (error && status === 401) {
		redirect('/login');
	}

	return (
		<div className="px-2 w-full">
			<div className="grid gap-4">
				<Pagination itemsTotal={response.count} type="admin" />
				<FilesWrapper files={response.files} total={response.count} type="admin" />
				<Pagination itemsTotal={response.count} type="admin" />
				<FileDialog />
			</div>
		</div>
	);
}
