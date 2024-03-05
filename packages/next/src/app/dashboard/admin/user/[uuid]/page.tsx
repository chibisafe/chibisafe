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

	const response = await fetchEndpoint({ type: 'admin', userUuid: params.uuid }, currentPage, perPage);
	const username = response.files[0]?.user?.username;
	return (
		<>
			<DashboardHeader title={`${username}'s files`} subtitle="As an admin, you can manage their files" />
			<div className="px-2">
				<FilesList type="admin" files={response.files} count={response.count} />
			</div>
		</>
	);
}
