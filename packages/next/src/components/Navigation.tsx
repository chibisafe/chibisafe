'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { NavigationMobile } from '@/components/NavigationMobile';
import { settingsAtom } from '@/lib/atoms/settings';
import { useAtomValue } from 'jotai';

export function Navigation({
	logo,
	serviceName = ''
}: {
	readonly logo: ReactNode;
	readonly serviceName?: string | undefined;
}) {
	const segment = useSelectedLayoutSegment();
	const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
	const settings = useAtomValue(settingsAtom);

	return (
		<div className="flex gap-6 md:gap-10">
			<Link href="/" className="hidden items-center space-x-2 md:flex">
				{logo}
				<span className="hidden font-bold sm:inline-block">{settings?.serviceName ?? serviceName}</span>
			</Link>
			<nav className="hidden gap-6 md:flex">
				<Link
					href="/dashboard"
					className={cn(
						'flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm text-foreground/60'
					)}
				>
					Dashboard
				</Link>
				<a
					href="/docs"
					rel="noopener noreferrer"
					className={cn(
						'flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm text-foreground/60'
					)}
				>
					Docs
				</a>
				<Link
					href="/faq"
					className={cn(
						'flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm',
						'/faq'.startsWith(`/${segment}`) ? 'text-foreground' : 'text-foreground/60'
					)}
				>
					FAQ
				</Link>
			</nav>
			<button
				className="flex items-center space-x-2 md:hidden"
				onClick={() => setShowMobileMenu(!showMobileMenu)}
				type="button"
			>
				{showMobileMenu ? <X /> : logo}
				<span className="font-bold">Menu</span>
			</button>
			{showMobileMenu ? (
				<NavigationMobile logo={logo} serviceName={settings?.serviceName ?? serviceName} />
			) : null}
		</div>
	);
}
