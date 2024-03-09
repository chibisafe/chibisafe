import type { BreadcrumbPage } from '@/types';
import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';

export default function Breadcrumbs({ pages = [] }: { readonly pages?: BreadcrumbPage[] }) {
	return pages.length ? (
		<nav aria-label="Breadcrumb" className="px-2 mb-2">
			<ol className="flex flex-wrap gap-2 text-sm text-muted-foreground">
				<li key="base">
					<Link className="hover:text-foreground" href="/dashboard">
						Dashboard
					</Link>
				</li>
				{pages.map((page, index) => (
					<>
						<li key={`chevron${index}`} className="flex items-center">
							<ChevronRightIcon className="w-4 h-4" />
						</li>
						<li key={`link${index}`}>
							<Link className="hover:text-foreground" href={page.url}>
								{page.name}
							</Link>
						</li>
					</>
				))}
			</ol>
		</nav>
	) : null;
}
