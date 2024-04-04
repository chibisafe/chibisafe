import type { Metadata } from 'next';

import { DashboardHeader } from '@/components/DashboardHeader';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import request from '@/lib/request';
import { InvitesTable } from '@/components/tables/invites-table/InvitesTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { createInvite } from '@/actions/InviteActions';

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
		<>
			<DashboardHeader
				title="Invites"
				subtitle="Manage and create new invites"
				breadcrumbs={[
					{ name: 'Admin', url: '/dashboard/admin' },
					{ name: 'Invites', url: '/dashboard/admin/invites' }
				]}
			>
				<form action={createInvite}>
					<Button type="submit">
						<Plus className="mr-2 h-4 w-4" />
						Create new invite
					</Button>
				</form>
			</DashboardHeader>
			<div className="px-2 w-full">
				<InvitesTable data={response?.invites} />
			</div>
		</>
	);
}
