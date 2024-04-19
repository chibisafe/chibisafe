import type { Metadata } from 'next';

import request from '@/lib/request';
import type { MetadataBuilder, Snippet } from '@/types';
import { SnippetViewer } from '@/components/SnippetViewer';

export async function generateMetadata({ params }: { readonly params: { identifier: string } }): Promise<Metadata> {
	const { data: response, error } = await request.get({
		url: `snippet/public/${params.identifier}`,
		options: {
			next: {
				tags: ['snippets']
			}
		}
	});

	if (error) {
		return {};
	}

	const snippet = response.snippet as Snippet;

	return {
		title: snippet.name,
		openGraph: {
			title: snippet.name,
			images: ['/og?section=snippet']
		},
		twitter: {
			title: snippet.name,
			images: ['/og?section=snippet']
		}
	} as MetadataBuilder;
}

export default async function PublicSnippetPage({ params }: { readonly params: { identifier: string } }) {
	const { data: response, error } = await request.get({
		url: `snippet/public/${params.identifier}`,
		options: {
			next: {
				tags: ['snippets']
			}
		}
	});

	if (error) {
		return 'There was an error';
	}

	const snippet = response.snippet as Snippet;

	return (
		<>
			<div className="px-2 w-full flex h-full flex-grow flex-col">
				<SnippetViewer snippet={snippet} showPublicLink={false} showTitleLink={false} />
			</div>
		</>
	);
}
