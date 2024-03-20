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

const items = [
	{
		title: 'Dashboard',
		href: '/dashboard'
	},
	{
		title: 'Docs',
		href: 'https://chibisafe.moe/docs'
	}
];

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
				{items.map((item, index) => (
					<Link
						key={index}
						href={item.href}
						className={cn(
							'flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm',
							item.href.startsWith(`/${segment}`) ? 'text-foreground' : 'text-foreground/60'
						)}
					>
						{item.title}
					</Link>
				))}
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
				<NavigationMobile items={items} logo={logo} serviceName={settings?.serviceName ?? serviceName} />
			) : null}
		</div>
	);
}
