import type { Metadata } from 'next';

import { DashboardHeader } from '@/components/DashboardHeader';
import { UserTable } from '@/components/user-table/UserTable';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import request from '@/lib/request';

export const metadata: Metadata = {
	title: 'Dashboard - Admin - Users'
};

export default async function DashboardAdminUsersPage() {
	const cookiesStore = cookies();
	const token = cookiesStore.get('token')?.value;
	if (!token) redirect('/');

	const authorization = {
		authorization: `Bearer ${token}`
	};

	const response = await request.get(`admin/users`, {}, authorization, {
		next: {
			tags: ['users']
		}
	});

	return (
		<>
			<DashboardHeader title="Users" subtitle="Manage all users" />
			<div className="px-2">
				<UserTable data={response.users} />
			</div>
		</>
	);
}
