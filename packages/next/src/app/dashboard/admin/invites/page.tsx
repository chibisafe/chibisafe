import type { Metadata } from 'next';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import request from '@/lib/request';
import { InvitesTable } from '@/components/tables/invites-table/InvitesTable';

export const metadata: Metadata = {
	title: 'Dashboard - Admin - Invites'
};

export default async function DashboardAdminInvitesPage() {
	const cookiesStore = cookies();
	const token = cookiesStore.get('token')?.value;
	if (!token) redirect('/');

	const authorization = {
		authorization: `Bearer ${token}`
	};

	const {
		data: response,
		error,
		status
	} = await request.get({
		url: `admin/invites`,
		headers: {
			...authorization
		},
		options: {
			next: {
				tags: ['invites']
			}
		}
	});

	if (error && status === 401) {
		redirect('/login');
	}

	return (
		<div className="px-2 w-full">
			<InvitesTable data={response?.invites} />
		</div>
	);
}
