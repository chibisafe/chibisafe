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
import { BanIpDrawer } from '@/components/drawers/BanIpDrawer';

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

	const {
		data: response,
		error,
		status
	} = await request.get({
		url: `admin/ip/list`,
		query: {
			page: currentPage,
			limit: perPage,
			search
		},
		headers: {
			...authorization
		},
		options: {
			next: {
				tags: ['ips']
			}
		}
	});

	if (error && status === 401) {
		redirect('/login');
	}

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
				<BanIpDialog className="hidden md:inline-flex" />
				<BanIpDrawer className="md:hidden inline-flex" />
			</DashboardHeader>
			<div className="px-2 w-full flex flex-col gap-4">
				<Suspense>
					<Pagination itemsTotal={response?.count ?? 0} />
				</Suspense>
				<IpTable data={response?.ips} />
			</div>
		</>
	);
}
