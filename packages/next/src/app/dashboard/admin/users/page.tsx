import type { Metadata } from 'next';

import { DashboardHeader } from '@/components/DashboardHeader';
import { UserTable } from '@/components/tables/user-table/UserTable';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import request from '@/lib/request';
import type { PageQuery } from '@/types';
import { Suspense } from 'react';
import { Pagination } from '@/components/Pagination';

export const metadata: Metadata = {
	title: 'Dashboard - Admin - Users'
};

export default async function DashboardAdminUsersPage({ searchParams }: { readonly searchParams: PageQuery }) {
	const cookiesStore = cookies();
	const token = cookiesStore.get('token')?.value;
	if (!token) redirect('/');

	const currentPage = searchParams.page ?? 1;
	const perPage = searchParams.limit ? (searchParams.limit > 50 ? 50 : searchParams.limit) : 50;
	const search = searchParams.search ?? '';

	const authorization = {
		authorization: `Bearer ${token}`
	};

	const response = await request.get(
		`admin/users`,
		{
			page: currentPage,
			limit: perPage,
			search
		},
		authorization,
		{
			next: {
				tags: ['users']
			}
		}
	);

	return (
		<>
			<DashboardHeader
				title="Users"
				subtitle="Manage all users"
				breadcrumbs={[
					{ name: 'Admin', url: '/dashboard/admin' },
					{ name: 'Users', url: '/dashboard/admin/users' }
				]}
			/>
			<div className="px-2">
				<Suspense>
					<Pagination itemsTotal={response.count} />
				</Suspense>
				<UserTable data={response.users} />
			</div>
		</>
	);
}
