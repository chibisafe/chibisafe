import type { Metadata } from 'next';

import { cookies } from 'next/headers';
import request from '@/lib/request';
import type { Snippet } from '@/types';
import { DashboardHeader } from '@/components/DashboardHeader';
import { DeleteSnippetDialog } from '@/components/dialogs/DeleteSnippetDialog';
import { SnippetViewer } from '@/components/SnippetViewer';
import { getDate } from '@/lib/time';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
	title: 'Dashboard - Snippets - Snippet'
};

export default async function PublicSnippetPage({ params }: { readonly params: { uuid: string } }) {
	const cookiesStore = cookies();
	const token = cookiesStore.get('token')?.value;

	const {
		data: response,
		error,
		status
	} = await request.get(
		`snippet/${params.uuid}`,
		{},
		{
			authorization: `Bearer ${token}`
		},
		{
			next: {
				tags: ['snippets']
			}
		}
	);

	if (error && status === 401) {
		redirect('/login');
	}

	const snippet = response.snippet as Snippet;

	return (
		<>
			<DashboardHeader
				title={snippet.name}
				subtitle={getDate(snippet.createdAt)}
				breadcrumbs={[
					{ name: 'Snippets', url: '/dashboard/snippets' },
					{ name: snippet.name, url: `/dashboard/admin/ip/${params.uuid}` }
				]}
			>
				<DeleteSnippetDialog uuid={snippet.uuid} />
			</DashboardHeader>
			<div className="px-2 flex h-full flex-grow flex-col">
				<SnippetViewer snippet={snippet} showTitle={false} showCreatedAt={false} />
			</div>
		</>
	);
}
