'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { NavigationMobile } from '@/components/NavigationMobile';
import { ChibisafeLogo } from '@/components/svg/ChibisafeLogo';

export function Navigation() {
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

	const segment = useSelectedLayoutSegment();
	const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false);
	return (
		<div className="flex gap-6 md:gap-10">
			<Link href="/" className="hidden items-center space-x-2 md:flex">
				<ChibisafeLogo className="h-6 w-6" />
				<span className="hidden font-bold sm:inline-block">chibisafe</span>
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
				{showMobileMenu ? <X /> : <ChibisafeLogo className="h-6 w-6" />}
				<span className="font-bold">Menu</span>
			</button>
			{showMobileMenu ? <NavigationMobile items={items} /> : null}
		</div>
	);
}
