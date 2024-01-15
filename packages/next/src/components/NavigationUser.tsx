'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '~/lib/useAuth';
import { useCurrentUser } from '~/lib/useCurrentUser';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	// DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export function NavigationUser() {
	const { logout } = useAuth();
	const router = useRouter();
	const user = useCurrentUser();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>{user?.username}</DropdownMenuTrigger>
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
					onSelect={event => {
						event.preventDefault();
						void logout();
						router.push('/');
					}}
				>
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
