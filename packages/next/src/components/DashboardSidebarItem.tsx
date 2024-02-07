'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

export function DashboardSidebarItem({
	href,
	name,
	Icon
}: {
	readonly Icon: LucideIcon;
	readonly href: string;
	readonly name: string;
}) {
	const path = usePathname();

	return (
		<Link href={href}>
			<span
				className={cn(
					'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
					path === href ? 'bg-accent' : 'transparent'
				)}
			>
				<Icon className="mr-2 h-4 w-4" />
				<span>{name}</span>
			</span>
		</Link>
	);
}
