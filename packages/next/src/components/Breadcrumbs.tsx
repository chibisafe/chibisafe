import type { BreadcrumbPage } from '@/types';
import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';
import { Fragment } from 'react';

export default function Breadcrumbs({ pages = [] }: { readonly pages?: BreadcrumbPage[] | undefined }) {
	if (!pages.length) return null;

	return (
		<nav aria-label="Breadcrumb" className="px-2">
			<ol className="flex flex-wrap gap-2 text-sm text-muted-foreground">
				<li>
					<Link className="hover:text-foreground" href="/dashboard">
						Dashboard
					</Link>
				</li>
				{pages.map(page => (
					<Fragment key={page.name}>
						<li className="flex items-center">
							<ChevronRightIcon className="w-4 h-4" />
						</li>
						<li>
							<Link className="hover:text-foreground" href={page.url}>
								{page.name}
							</Link>
						</li>
					</Fragment>
				))}
			</ol>
		</nav>
	);
}
