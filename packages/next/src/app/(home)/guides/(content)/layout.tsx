import { cn } from '@/lib/utils';
import { buttonVariants } from '@/styles/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import type { PropsWithChildren } from 'react';

export default function GuidesContentLayout({ children }: PropsWithChildren<{}>) {
	return (
		<article className="container relative max-w-5xl py-6 lg:py-10">
			{children}
			<hr className="mt-12" />
			<div className="flex justify-center py-6 lg:py-10">
				<Link href="/guides" className={cn(buttonVariants({ variant: 'ghost' }))}>
					<ChevronLeft className="mr-2 h-4 w-4" />
					See all guides
				</Link>
			</div>
		</article>
	);
}
