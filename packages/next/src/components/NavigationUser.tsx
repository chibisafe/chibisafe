'use client';

import Link from 'next/link';
import { useAtom } from 'jotai';

import { currentUserAtom } from '@/lib/atoms/currentUser';
import { logout } from '@/lib/logout';
import { cn } from '@/lib/utils';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	// DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { buttonVariants } from './ui/button';

export function NavigationUser() {
	const [currentUser, setCurrentUser] = useAtom(currentUserAtom);

	return currentUser?.uuid ? (
		<DropdownMenu>
			<DropdownMenuTrigger className="ml-4">{currentUser.username}</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{/* <div className="flex items-center justify-start gap-2 p-2">
					<div className="flex flex-col space-y-1 leading-none">
						<p className="font-medium">{user?.username}</p>
					</div>
				</div>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link href="/dashboard">Dashboard</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link href="/dashboard/billing">Billing</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link href="/dashboard/settings">Settings</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator /> */}
				<DropdownMenuItem
					className="cursor-pointer"
					onSelect={async event => {
						event.preventDefault();
						await logout();
						setCurrentUser(null);
					}}
				>
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	) : (
		<Link
			href="/login"
			className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'px-4 ml-4 items-center')}
		>
			Login
		</Link>
	);
}
