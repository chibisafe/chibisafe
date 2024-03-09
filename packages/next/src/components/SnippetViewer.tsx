import type { Snippet } from '@/types';
import { ArrowUpRightFromSquare } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { highlighter } from '@/lib/shiki';

dayjs.extend(relativeTime);

export const SnippetViewer = ({
	snippet,
	showTitle = true,
	showCreatedAt = true,
	showLanguage = true,
	showPublicLink = true,
	showRawLink = true,
	showTitleLink = true,
	maxLines = null
}: PropsWithChildren<{
	readonly maxLines?: number | null;
	readonly showCreatedAt?: boolean;
	readonly showLanguage?: boolean;
	readonly showPublicLink?: boolean;
	readonly showRawLink?: boolean;
	readonly showTitle?: boolean;
	readonly showTitleLink?: boolean;
	readonly snippet: Snippet;
}>) => {
	return (
		<div className="border border-1 border-accent rounded p-4">
			<div className="flex items-center mb-4">
				<div className="mb-2">
					{showTitle ? (
						<h2 className="text-xl font-extrabold leading-tight tracking-tighter md:text-2x">
							{showTitleLink ? (
								<a href={`/dashboard/snippets/${snippet.uuid}`} className="link">
									{snippet.name}
								</a>
							) : (
								snippet.name
							)}
						</h2>
					) : null}
					{showCreatedAt ? (
						<h3 className="text-sm leading-tight tracking-tighter">{dayjs(snippet.createdAt).fromNow()}</h3>
					) : null}
					{showLanguage ? (
						<h3 className="text-sm leading-tight tracking-tighter">{snippet.language}</h3>
					) : null}
				</div>
				<div className="flex-1" />
				<div className="mb-2">
					{showPublicLink ? (
						<a
							href={snippet.link}
							target="_blank"
							rel="noopener noreferrer"
							className="link inline-flex items-center ml-2"
						>
							Public link <ArrowUpRightFromSquare className="w-3 h-3 ml-1" />
						</a>
					) : null}
					{showRawLink ? (
						<a
							href={snippet.raw}
							target="_blank"
							rel="noopener noreferrer"
							className="link ml-4 inline-flex items-center"
						>
							Open raw <ArrowUpRightFromSquare className="w-3 h-3 ml-1" />
						</a>
					) : null}
				</div>
			</div>
			<div
				key={snippet.uuid}
				// eslint-disable-next-line react/no-danger
				dangerouslySetInnerHTML={{
					__html: highlighter.codeToHtml(
						maxLines ? snippet.content.split('\n').slice(0, 10).join('\n') : snippet.content,
						{
							lang: snippet.language,
							theme: 'github-dark-dimmed'
						}
					)
				}}
			/>
		</div>
	);
};
