import type { Metadata } from 'next';

import { DashboardHeader } from '@/components/DashboardHeader';
import { cookies } from 'next/headers';
import request from '@/lib/request';
import type { PageQuery } from '@/types';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { Pagination } from '@/components/Pagination';
import { LinksTable } from '@/components/tables/links-table/LinksTable';

export const metadata: Metadata = {
	title: 'Dashboard - Admin - Short URLs'
};

export default async function DashboardLinksPage({ searchParams }: { readonly searchParams: PageQuery }) {
	const cookiesStore = cookies();
	const token = cookiesStore.get('token')?.value;
	if (!token) redirect('/');

	const currentPage = searchParams.page ?? 1;
	const perPage = searchParams.limit ? (searchParams.limit > 50 ? 50 : searchParams.limit) : 50;
	const search = searchParams.search ?? '';

	const {
		data: response,
		error,
		status
	} = await request.get({
		url: `admin/links`,
		query: {
			page: currentPage,
			limit: perPage,
			search
		},
		headers: {
			authorization: `Bearer ${token}`
		},
		options: {
			next: {
				tags: ['links']
			}
		}
	});

	if (error && status === 401) {
		redirect('/login');
	}

	return (
		<>
			<DashboardHeader title="Short URLs" subtitle="Manage created short URLs" />
			<div className="px-2 w-full flex flex-col gap-4">
				<Suspense>
					<Pagination itemsTotal={response?.count} />
				</Suspense>
				<LinksTable data={response?.links} isAdmin />
			</div>
		</>
	);
}
