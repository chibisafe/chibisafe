import type { Metadata } from 'next';

import { cookies } from 'next/headers';
import request from '@/lib/request';
import type { Snippet } from '@/types';
import { SnippetViewer } from '@/components/SnippetViewer';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
	title: 'Public - Snippet'
};

export default async function PublicSnippetPage({ params }: { readonly params: { identifier: string } }) {
	const cookiesStore = cookies();
	const token = cookiesStore.get('token')?.value;

	const {
		data: response,
		error,
		status
	} = await request.get({
		url: `snippet/public/${params.identifier}`,
		headers: {
			authorization: `Bearer ${token}`
		},
		options: {
			next: {
				tags: ['snippets']
			}
		}
	});

	if (error && status === 401) {
		redirect('/login');
	}

	const snippet = response.snippet as Snippet;

	return (
		<>
			<div className="px-2 flex h-full flex-grow flex-col">
				<SnippetViewer snippet={snippet} showPublicLink={false} showTitleLink={false} />
			</div>
		</>
	);
}
