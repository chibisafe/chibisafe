import type { Metadata } from 'next';

import { DashboardHeader } from '@/components/DashboardHeader';
import { fetchEndpoint } from '@/lib/fileFetching';
import type { PageQuery } from '@/types';
import { FilesList } from '@/components/FilesList';
import { BanThisIpDialog } from '@/components/dialogs/BanThisIpDialog';

export const metadata: Metadata = {
	title: 'Dashboard - Admin - IPs'
};

export default async function DashboardPage({
	params,
	searchParams
}: {
	readonly params: { ip: string };
	readonly searchParams: PageQuery;
}) {
	const currentPage = searchParams.page ?? 1;
	const perPage = searchParams.limit ? (searchParams.limit > 50 ? 50 : searchParams.limit) : 50;

	// TODO: Fetching is broken, I believe it's the backend that's broken
	const response = await fetchEndpoint({ type: 'admin', ip: params.ip }, currentPage, perPage);
	console.log(response);
	return (
		<>
			<DashboardHeader
				title={`${params.ip} files`}
				subtitle="As an admin, you can manage their files"
				breadcrumbs={[
					{ name: 'Admin', url: '/dashboard/admin' },
					{ name: 'Banned IPs', url: '/dashboard/admin/ip' },
					{ name: params.ip, url: `/dashboard/admin/ip/${params.ip}` }
				]}
			>
				{response.banned ? null : <BanThisIpDialog ip={params.ip} />}
			</DashboardHeader>
			<div className="px-2">
				<FilesList type="admin" files={response.files} count={response.count} />
			</div>
		</>
	);
}
