import type { PropsWithChildren, ReactNode } from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';

export function NavigationMobile({
	children,
	logo,
	serviceName = ''
}: PropsWithChildren<{
	readonly logo: ReactNode;
	readonly serviceName?: string | undefined;
}>) {
	return (
		<div
			className={cn(
				'fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden'
			)}
		>
			<div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
				<Link href="/" className="flex items-center space-x-2">
					{logo}
					<span className="font-bold">{serviceName}</span>
				</Link>
				<nav className="grid grid-flow-row auto-rows-max text-sm">
					<Link
						href="/dashboard"
						className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline"
					>
						Dashboard
					</Link>
					<a
						href="/docs"
						rel="noopener noreferrer"
						className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline"
					>
						Docs
					</a>
				</nav>
				{children}
			</div>
		</div>
	);
}
