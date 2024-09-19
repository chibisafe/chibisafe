import type { Metadata } from 'next';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import request from '@/lib/request';
import { TagsTable } from '@/components/tables/tags-table/TagsTable';
import type { PageQuery } from '@/types';
import { Pagination } from '@/components/Pagination';

export const metadata: Metadata = {
	title: 'Dashboard - Tags'
};

export default async function DashboardTagsPage({ searchParams }: { readonly searchParams: PageQuery }) {
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
		url: `tags`,
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
				tags: ['tags']
			}
		}
	});

	if (error && status === 401) {
		redirect('/login');
	}

	return (
		<div className="px-2 w-full flex flex-col gap-4">
			<Pagination itemsTotal={response?.count} />
			<TagsTable data={response?.tags} />
		</div>
	);
}
