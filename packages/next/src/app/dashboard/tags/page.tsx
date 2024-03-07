import type { Metadata } from 'next';

import { DashboardHeader } from '@/components/DashboardHeader';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import request from '@/lib/request';
import { TagsTable } from '@/components/tables/tags-table/TagsTable';
import { CreateTagDialog } from '@/components/dialogs/CreateTagDialog';
export const metadata: Metadata = {
	title: 'Dashboard - Admin - Tags'
};

export default async function DashboardPage() {
	const cookiesStore = cookies();
	const token = cookiesStore.get('token')?.value;
	if (!token) redirect('/');

	const authorization = {
		authorization: `Bearer ${token}`
	};

	const response = await request.get(`tags`, {}, authorization, {
		next: {
			tags: ['tags']
		}
	});
	return (
		<>
			<DashboardHeader title="Tags" subtitle="Manage and create tags">
				<CreateTagDialog />
			</DashboardHeader>
			<div className="px-2">
				<TagsTable data={response.tags} />
			</div>
		</>
	);
}
