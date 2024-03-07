import type { Metadata } from 'next';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DashboardHeader } from '@/components/DashboardHeader';
import { bundledLanguages, getHighlighter } from 'shiki';
import { cookies } from 'next/headers';
import request from '@/lib/request';
import type { Snippet } from '@/types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
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

	// {
	//   "uuid": "802ce1ea-cb43-40bb-90b4-407d02c15592",
	//   "parentUuid": null,
	//   "name": "asd",
	//   "content": "export function Pagination({ itemsTotal = 0 }: { readonly itemsTotal: number }) {\n\tconst router = useRouter();\n\tconst searchParams = useSearchParams();\n\tconst pathname = usePathname();\n\n\tconst currentPage = searchParams.get('page') ? Number.parseInt(searchParams.get('page')!, 10) : 1;\n\tconst perPage = searchParams.get('limit')\n\t\t? Number.parseInt(searchParams.get('limit')!, 10) > 50\n\t\t\t? 50\n\t\t\t: Number.parseInt(searchParams.get('limit')!, 10)\n\t\t: 50;\n\n\tconst totalPages = Math.ceil(itemsTotal / perPage);\n\t// eslint-disable-next-line unicorn/new-for-builtins\n\tconst totalPagesForDropdown: Item[] = Array.from(Array(totalPages)).map((_, i) => ({\n\t\tlabel: i + 1,\n\t\tvalue: i + 1\n\t}));",
	//   "language": "typescript",
	//   "raw": "http://localhost:8000/api/snippet/aq1n0sh1kn2y/raw",
	//   "link": "http://localhost:8001/s/aq1n0sh1kn2y",
	//   "createdAt": "2024-03-07T18:29:46.497Z"
	// },

	const snippets = response.snippets;
	console.log(snippets);

	return (
		<>
			<DashboardHeader title="Snippets" subtitle="Manage and create snippets">
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					New snippet
				</Button>
			</DashboardHeader>
			<div className="px-2 flex flex-col gap-6">
				{snippets.map((snippet: Snippet) => {
					return (
						<div className="border border-1 border-accent rounded p-4">
							<div className="flex items-center mb-4">
								<div className="mb-2">
									<h2 className="text-xl font-extrabold leading-tight tracking-tighter md:text-2x">
										{snippet.name}
									</h2>
									<h3 className="text-sm leading-tight tracking-tighter">
										{dayjs(snippet.createdAt).fromNow()}
									</h3>
								</div>
								<div className="flex-1" />
								<div className="mb-2">
									<a href={snippet.link} target="_blank" rel="noopener noreferrer" className="link">
										Open snippet
									</a>
									<a
										href={snippet.raw}
										target="_blank"
										rel="noopener noreferrer"
										className="link ml-4"
									>
										Open raw
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
