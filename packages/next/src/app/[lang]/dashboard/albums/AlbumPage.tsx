import { AlbumMasonry } from '@/components/AlbumMasonry';
import { Pagination } from '@/components/Pagination';
import request from '@/lib/request';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function AlbumPage({
	page,
	limit,
	search
}: {
	readonly limit: number;
	readonly page: number;
	readonly search: string;
}) {
	const cookiesStore = cookies();
	const token = cookiesStore.get('token')?.value;
	if (!token) redirect('/');

	const {
		data: response,
		error,
		status
	} = await request.get({
		url: 'albums',
		query: {
			page,
			limit,
			search
		},
		headers: {
			authorization: `Bearer ${token}`
		},
		options: {
			next: {
				tags: ['albums']
			}
		}
	});

	if (error && status === 401) {
		redirect('/login');
	}

	return (
		<>
			<Pagination itemsTotal={response?.count} />
			<AlbumMasonry albums={response?.albums} />
		</>
	);
}
