'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAtomValue } from 'jotai';
import { currentUserAtom } from '~/lib/useCurrentUser';

import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';

export function DashboardSidebar() {
	const path = usePathname();
	const currentUser = useAtomValue(currentUserAtom);

	return (
		<>
			<nav className="grid items-start gap-1">
				<h3 className="text-muted-foreground text-sm pointer-events-none">Main</h3>
				{siteConfig.sidebar.main.map((item, index) => {
					const Icon = Icons[item.icon];
					return (
						item.href && (
							<Link key={index} href={item.href}>
								<span
									className={cn(
										'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
										path === item.href ? 'bg-accent' : 'transparent'
									)}
								>
									<Icon className="mr-2 h-4 w-4" />
									<span>{item.name}</span>
								</span>
							</Link>
						)
					);
				})}
			</nav>
			<nav className="grid items-start gap-1 mt-4">
				<h3 className="text-muted-foreground text-sm pointer-events-none">Account</h3>
				{siteConfig.sidebar.account.map((item, index) => {
					const Icon = Icons[item.icon];
					return (
						item.href && (
							<Link key={index} href={item.href}>
								<span
									className={cn(
										'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
										path === item.href ? 'bg-accent' : 'transparent'
									)}
								>
									<Icon className="mr-2 h-4 w-4" />
									<span>{item.name}</span>
								</span>
							</Link>
						)
					);
				})}
			</nav>
			{currentUser?.roles.find(role => role.name === 'admin') ? (
				<nav className="grid items-start gap-1 mt-4">
					<h3 className="text-muted-foreground text-sm pointer-events-none">Admin</h3>
					{siteConfig.sidebar.admin.map((item, index) => {
						const Icon = Icons[item.icon];
						return (
							item.href && (
								<Link key={index} href={item.href}>
									<span
										className={cn(
											'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
											path === item.href ? 'bg-accent' : 'transparent'
										)}
									>
										<Icon className="mr-2 h-4 w-4" />
										<span>{item.name}</span>
									</span>
								</Link>
							)
						);
					})}
				</nav>
			) : null}
		</>
	);
}