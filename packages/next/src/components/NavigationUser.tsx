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
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { buttonVariants } from '@/styles/button';

export function NavigationUser() {
	const [currentUser, setCurrentUser] = useAtom(currentUserAtom);

	return currentUser?.uuid ? (
		<DropdownMenu>
			<DropdownMenuTrigger className="text-lg font-medium sm:text-sm">{currentUser.username}</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
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
			className={cn(
				buttonVariants({ variant: 'secondary', size: 'sm' }),
				'px-4 items-center text-lg font-medium sm:text-sm'
			)}
		>
			Login
		</Link>
	);
}
