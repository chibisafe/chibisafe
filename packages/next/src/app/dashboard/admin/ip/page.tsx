import type { Metadata } from 'next';

import { DashboardHeader } from '@/components/DashboardHeader';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import request from '@/lib/request';
import { IpTable } from '@/components/tables/ip-table/IpTable';
import { BanIpDialog } from '@/components/dialogs/BanIpDialog';
export const metadata: Metadata = {
	title: 'Dashboard - Admin - IPs'
};

export default async function DashboardPage() {
	const cookiesStore = cookies();
	const token = cookiesStore.get('token')?.value;
	if (!token) redirect('/');

	const authorization = {
		authorization: `Bearer ${token}`
	};

	const response = await request.get(`admin/ip/list`, {}, authorization, {
		next: {
			tags: ['ips']
		}
	});
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
				<IpTable data={response} />
			</div>
		</>
	);
}
