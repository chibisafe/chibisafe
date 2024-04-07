'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ExternalLinkIcon, type LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

export function DashboardSidebarItem({
	href,
	name,
	Icon,
	isLink = false
}: {
	readonly Icon: LucideIcon;
	readonly href: string;
	readonly isLink?: boolean;
	readonly name: string;
}) {
	const path = usePathname();

	return (
		<Link href={href}>
			<span
				className={cn(
					'group flex items-center rounded-md px-3 text-sm font-medium',
					path === href ? 'bg-accent' : 'transparent',
					isLink ? 'bg-transparent link py-0' : 'hover:bg-accent hover:text-accent-foreground py-2'
				)}
			>
				{isLink ? null : <Icon className="h-4 w-4 mr-2" />}
				<span>{name}</span>
				{isLink ? <ExternalLinkIcon className="h-4 w-4 ml-2" /> : null}
			</span>
		</Link>
	);
}
