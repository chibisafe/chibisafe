import type { Metadata } from 'next';

import { DashboardHeader } from '@/components/DashboardHeader';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import request from '@/lib/request';
import { IpTable } from '@/components/tables/ip-table/IpTable';
import { BanIpDialog } from '@/components/dialogs/BanIpDialog';
import { Suspense } from 'react';
import { Pagination } from '@/components/Pagination';
import type { PageQuery } from '@/types';

export const metadata: Metadata = {
	title: 'Dashboard - Admin - IPs'
};

export default async function DashboardAdminIPsPage({ searchParams }: { readonly searchParams: PageQuery }) {
	const cookiesStore = cookies();
	const token = cookiesStore.get('token')?.value;
	if (!token) redirect('/');

	const authorization = {
		authorization: `Bearer ${token}`
	};

	const currentPage = searchParams.page ?? 1;
	const perPage = searchParams.limit ? (searchParams.limit > 50 ? 50 : searchParams.limit) : 50;
	const search = searchParams.search ?? '';

	const response = await request.get(
		`admin/ip/list`,
		{
			page: currentPage,
			limit: perPage,
			search
		},
		authorization,
		{
			next: {
				tags: ['ips']
			}
		}
	);

	return (
		<>
			<DashboardHeader
				title="Banned IPs"
				subtitle="Manage banned IPs"
				breadcrumbs={[
					{ name: 'Admin', url: '/dashboard/admin' },
					{ name: 'Banned IPs', url: '/dashboard/admin/ip' }
				]}
			>
				<BanIpDialog />
			</DashboardHeader>
			<div className="px-2">
				<Suspense>
					<Pagination itemsTotal={response.count} />
				</Suspense>
				<IpTable data={response.ips} />
			</div>
		</>
	);
}
