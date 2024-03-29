'use client';

import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { useState, type PropsWithChildren, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { buttonVariants } from '@/styles/button';
import { usePathname } from 'next/navigation';
import { DashboardSidebar } from './DashboardSidebar';
import { Button } from './ui/button';
import { currentUserAtom } from '@/lib/atoms/currentUser';
import { useAtom } from 'jotai';
import { logout } from '@/lib/logout';

const BaseDrawer = ({ path, onClick }: PropsWithChildren<{ onClick(): void; readonly path: string }>) => {
	const [open, setOpen] = useState(false);
	const closeDrawer = () => {
		setOpen(false);
		onClick();
	};

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger className="w-full">
				<span className={cn(buttonVariants({ variant: 'default' }), 'w-full')}>Go to page</span>
			</DrawerTrigger>
			<DrawerContent>
				<div className="p-8">
					<nav className="flex flex-col gap-2" onClick={() => closeDrawer()}>
						<Link
							href="/"
							className={cn(
								buttonVariants({ variant: 'link' }),
								'text-lg font-medium',
								path === '/' ? 'underline' : ''
							)}
						>
							Home
						</Link>
						<Link
							href="/dashboard"
							className={cn(
								buttonVariants({ variant: 'link' }),
								'text-lg font-medium',
								path?.startsWith('/dashboard') ? 'underline' : ''
							)}
						>
							Dashboard
						</Link>
						<a
							href="/docs"
							rel="noopener noreferrer"
							target="_blank"
							className={cn(buttonVariants({ variant: 'link' }), 'text-lg font-medium')}
						>
							Docs
						</a>
						<Link
							href="/faq"
							className={cn(
								buttonVariants({ variant: 'link' }),
								'text-lg font-medium',
								path === '/faq' ? 'underline' : ''
							)}
						>
							FAQ
						</Link>
					</nav>
				</div>
			</DrawerContent>
		</Drawer>
	);
};

export const NavigationDrawer = ({
	className = '',
	logo
}: PropsWithChildren<{ readonly className?: string | undefined; readonly logo: ReactNode }>) => {
	const path = usePathname();
	const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
	const [open, setOpen] = useState(false);

	const doLogout = async () => {
		await logout();
		setCurrentUser(null);
		setOpen(false);
	};

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger className={cn(className, 'flex gap-2 justify-center items-center')}>
				<svg
					strokeWidth="1.5"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className="h-6 w-6"
				>
					<path
						d="M3 5H11"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M3 12H16"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M3 19H21"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
				{logo}
			</DrawerTrigger>
			<DrawerContent>
				<div className="py-4 px-8">
					<BaseDrawer path={path} onClick={() => setOpen(false)} />
				</div>
				<div className="py-4 px-8 overflow-auto">
					{path.startsWith('/dashboard') ? (
						<nav className="grid items-start gap-1 mb-8">
							<DashboardSidebar onClick={() => setOpen(false)} />
						</nav>
					) : null}
					{currentUser?.uuid ? (
						<Button className="w-full mb-8" variant="secondary" onClick={async () => doLogout()}>
							Log out
						</Button>
					) : (
						<Link
							href="/login"
							className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'w-full')}
							onClick={() => setOpen(false)}
						>
							Login
						</Link>
					)}
				</div>
			</DrawerContent>
		</Drawer>
	);
};
