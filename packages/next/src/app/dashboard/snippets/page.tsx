import type { Metadata } from 'next';

import { DashboardHeader } from '@/components/DashboardHeader';
import { cookies } from 'next/headers';
import request from '@/lib/request';
import type { Snippet } from '@/types';
import { CreateSnippetDialog } from '@/components/dialogs/CreateSnippetDialog';
import { SnippetViewer } from '@/components/SnippetViewer';

export const metadata: Metadata = {
	title: 'Dashboard - Snippets'
};

export default async function DashboardPage() {
	const cookiesStore = cookies();
	const token = cookiesStore.get('token')?.value;

	const response = await request.get(
		`snippets`,
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

	return (
		<>
			<DashboardHeader title="Snippets" subtitle="Manage and create snippets">
				<CreateSnippetDialog />
			</DashboardHeader>
			<div className="px-2 flex flex-col gap-6">
				{response.snippets.map((snippet: Snippet) => {
					return <SnippetViewer snippet={snippet} maxLines={10} />;
				})}
			</div>
		</>
	);
}
