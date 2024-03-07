import type { Metadata } from 'next';

import { DashboardHeader } from '@/components/DashboardHeader';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import request from '@/lib/request';
import { TagsTable } from '@/components/tables/tags-table/TagsTable';
import { CreateTagDialog } from '@/components/dialogs/CreateTagDialog';
import type { PageQuery } from '@/types';
import { Suspense } from 'react';
import { Pagination } from '@/components/Pagination';
export const metadata: Metadata = {
	title: 'Dashboard - Admin - Tags'
};

export default async function DashboardPage({ searchParams }: { searchParams: PageQuery }) {
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
		`tags`,
		{
			page: currentPage,
			limit: perPage,
			search
		},
		authorization,
		{
			next: {
				tags: ['tags']
			}
		}
	);
	return (
		<>
			<DashboardHeader title="Tags" subtitle="Manage and create tags">
				<CreateTagDialog />
			</DashboardHeader>
			<div className="px-2">
				<Suspense>
					<Pagination itemsTotal={response.count} />
				</Suspense>
				<TagsTable data={response.tags} />
			</div>
		</>
	);
}
