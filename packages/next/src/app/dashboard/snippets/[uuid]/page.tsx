import type { Metadata } from 'next';

import { cookies } from 'next/headers';
import request from '@/lib/request';
import dayjs from 'dayjs';
import { ArrowUpRightFromSquare } from 'lucide-react';
import { bundledLanguages, getHighlighter } from 'shiki';
import type { Snippet } from '@/types';
import { DashboardHeader } from '@/components/DashboardHeader';
import relativeTime from 'dayjs/plugin/relativeTime';
import { DeleteSnippetDialog } from '@/components/dialogs/DeleteSnippetDialog';

dayjs.extend(relativeTime);

export const metadata: Metadata = {
	title: 'Dashboard - Snippets - Snippet'
};

const highlighter = await getHighlighter({
	themes: ['github-dark-dimmed'],
	langs: Object.keys(bundledLanguages)
});

export default async function PublicSnippetPage({ params }: { readonly params: { uuid: string } }) {
	const cookiesStore = cookies();
	const token = cookiesStore.get('token')?.value;

	const response = await request.get(
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

	const snippet = response.snippet as Snippet;

	return (
		<>
			<DashboardHeader title={snippet.name} subtitle={dayjs(snippet.createdAt).fromNow()}>
				<DeleteSnippetDialog uuid={snippet.uuid} />
			</DashboardHeader>
			<div className="px-2 flex h-full flex-grow flex-col">
				<div className="border border-1 border-accent rounded p-4">
					<div className="flex items-center mb-4">
						<div className="mb-2">
							<h3 className="text-sm leading-tight tracking-tighter">{snippet.language}</h3>
						</div>
						<div className="flex-1" />
						<div className="mb-2">
							<a
								href={snippet.link}
								target="_blank"
								rel="noopener noreferrer"
								className="link inline-flex items-center ml-2"
							>
								Public link <ArrowUpRightFromSquare className="w-3 h-3 ml-1" />
							</a>
							<a
								href={snippet.raw}
								target="_blank"
								rel="noopener noreferrer"
								className="link ml-4 inline-flex items-center"
							>
								Open raw <ArrowUpRightFromSquare className="w-3 h-3 ml-1" />
							</a>
						</div>
					</div>
					<div
						key={snippet.uuid}
						// eslint-disable-next-line react/no-danger
						dangerouslySetInnerHTML={{
							__html: highlighter.codeToHtml(snippet.content, {
								lang: snippet.language,
								theme: 'github-dark-dimmed'
							})
						}}
					/>
				</div>
			</div>
		</>
	);
}
