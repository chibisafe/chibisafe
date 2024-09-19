import type { Metadata } from 'next';

import { UserTable } from '@/components/tables/user-table/UserTable';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import request from '@/lib/request';
import type { PageQuery } from '@/types';
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

	const {
		data: response,
		error,
		status
	} = await request.get({
		url: `admin/users`,
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
				tags: ['users']
			}
		}
	});

	if (error && status === 401) {
		redirect('/login');
	}

	return (
		<>
			<div className="px-2 w-full flex flex-col gap-4">
				<Pagination itemsTotal={response?.count} />
				<UserTable data={response?.users} />
			</div>
		</>
	);
}
