import type { Metadata } from 'next';
import type { PageQuery } from '@/types';

import { fetchEndpoint } from '@/lib/fileFetching';
import { DashboardHeader } from '@/components/DashboardHeader';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { Pagination } from '@/components/Pagination';
import { FilesWrapper } from '@/components/FilesWrapper';
import { FileDialog } from '@/components/dialogs/FileDialog';

export const metadata: Metadata = {
	title: 'Dashboard - Admin - User'
};

export default async function DashboardAdminUserPage({
	params,
	searchParams
}: {
	readonly params: { uuid: string };
	readonly searchParams: PageQuery;
}) {
	const currentPage = searchParams.page ?? 1;
	const perPage = searchParams.limit ? (searchParams.limit > 50 ? 50 : searchParams.limit) : 50;
	const search = searchParams.search ?? '';

	const {
		data: response,
		error,
		status
	} = await fetchEndpoint({ type: 'admin', userUuid: params.uuid }, currentPage, perPage, search);
	if (error && status === 401) {
		redirect('/login');
	}

	const username = response.user?.username;
	return (
		<>
			<DashboardHeader
				title={`${username}'s files`}
				subtitle="As an admin, you can manage their files"
				breadcrumbs={[
					{ name: 'Admin', url: '/dashboard/admin' },
					{ name: 'Users', url: '/dashboard/admin/users' },
					{ name: username, url: `/dashboard/admin/users/${params.uuid}` }
				]}
			/>
			<div className="px-2 w-full">
				<div className="grid gap-4">
					<Suspense>
						<Pagination itemsTotal={response.count} type="admin" />
						<FilesWrapper files={response.files} total={response.count} type="admin" />
						<Pagination itemsTotal={response.count} type="admin" />
					</Suspense>
					<FileDialog />
				</div>
			</div>
		</>
	);
}
