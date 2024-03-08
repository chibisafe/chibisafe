import type { Metadata } from 'next';

import { cookies } from 'next/headers';
import request from '@/lib/request';
import dayjs from 'dayjs';
import { ArrowUpRightFromSquare } from 'lucide-react';
import { bundledLanguages, getHighlighter } from 'shiki';
import type { Snippet } from '@/types';

export const metadata: Metadata = {
	title: 'Public - Snippet'
};

const highlighter = await getHighlighter({
	themes: ['github-dark-dimmed'],
	langs: Object.keys(bundledLanguages)
});

export default async function PublicSnippetPage({ params }: { readonly params: { identifier: string } }) {
	const cookiesStore = cookies();
	const token = cookiesStore.get('token')?.value;

	const response = await request.get(
		`snippet/public/${params.identifier}`,
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
			<div className="px-2 flex h-full flex-grow flex-col">
				<div className="border border-1 border-accent rounded p-4">
					<div className="flex items-center mb-4">
						<div className="mb-2">
							<h2 className="text-xl font-extrabold leading-tight tracking-tighter md:text-2x">
								{snippet.name}
							</h2>
							<h3 className="text-sm leading-tight tracking-tighter">
								{dayjs(snippet.createdAt).fromNow()}
							</h3>
							<h3 className="text-sm leading-tight tracking-tighter">{snippet.language}</h3>
						</div>
						<div className="flex-1" />
						<div className="mb-2">
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
