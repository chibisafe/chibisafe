import type { Metadata } from 'next';
import type { PageQuery } from '@/types';

import { fetchEndpoint } from '@/lib/fileFetching';
import { DashboardHeader } from '@/components/DashboardHeader';
import { FilesList } from '@/components/FilesList';

export const metadata: Metadata = {
	title: 'Dashboard - Admin - User'
};

export default async function DashboardAdminUserPage({
	params,
	searchParams
}: {
	params: { uuid: string };
	searchParams: PageQuery;
}) {
	const currentPage = searchParams.page ?? 1;
	const perPage = searchParams.limit ? (searchParams.limit > 50 ? 50 : searchParams.limit) : 50;
	const search = searchParams.search ?? '';

	const response = await fetchEndpoint({ type: 'admin', userUuid: params.uuid }, currentPage, perPage, search);
	// TODO: If the user hasn't uploaded any files, the response will be an empty array
	// and the username will be undefined
	const username = response.files[0]?.user?.username;
	return (
		<>
			<DashboardHeader
				title={`${username}'s files`}
				subtitle="As an admin, you can manage their files"
				breadcrumbs={[
					{ name: 'Admin', url: '/dashboard/admin' },
					{ name: 'Users', url: '/dashboard/admin/users' },
					{ name: username, url: `/dashboard/admin/user/${params.uuid}` }
				]}
			/>
			<div className="px-2">
				<FilesList type="admin" files={response.files} count={response.count} />
			</div>
		</>
	);
}
