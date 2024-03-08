import type { Metadata } from 'next';
import { ArrowUpRightFromSquare } from 'lucide-react';

import { DashboardHeader } from '@/components/DashboardHeader';
import { bundledLanguages, getHighlighter } from 'shiki';
import { cookies } from 'next/headers';
import request from '@/lib/request';
import type { Snippet } from '@/types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { CreateSnippetDialog } from '@/components/dialogs/CreateSnippetDialog';

dayjs.extend(relativeTime);

export const metadata: Metadata = {
	title: 'Dashboard - Snippets'
};

const highlighter = await getHighlighter({
	themes: ['github-dark-dimmed'],
	langs: Object.keys(bundledLanguages)
});

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
					return (
						<div className="border border-1 border-accent rounded p-4">
							<div className="flex items-center mb-4">
								<div className="mb-2">
									<h2 className="text-xl font-extrabold leading-tight tracking-tighter md:text-2x">
										<a href={`/dashboard/snippets/${snippet.uuid}`} className="link">
											{snippet.name}
										</a>
									</h2>
									<h3 className="text-sm leading-tight tracking-tighter">
										{dayjs(snippet.createdAt).fromNow()}
									</h3>
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
									__html: highlighter.codeToHtml(
										snippet.content.split('\n').slice(0, 10).join('\n'),
										{
											lang: snippet.language,
											theme: 'github-dark-dimmed'
										}
									)
								}}
							/>
						</div>
					);
				})}
			</div>
		</>
	);
}
