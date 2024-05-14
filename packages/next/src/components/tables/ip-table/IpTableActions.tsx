import { type PropsWithChildren } from 'react';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { IpActionsButton } from './IpActionsButton';
import { MoreHorizontalIcon } from 'lucide-react';
import Link from 'next/link';

export function IpTableActions({ ip }: PropsWithChildren<{ readonly ip: string }>) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size={'icon'} title="Actions">
					<MoreHorizontalIcon className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end">
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<Link href={`/dashboard/admin/ip/${ip}`}>View files</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem className="p-0" onSelect={e => e.preventDefault()}>
						<IpActionsButton
							ip={ip}
							type="unban"
							description="This will let the affected IP interact with chibisafe services again. Are you sure?"
						>
							Unban
						</IpActionsButton>
					</DropdownMenuItem>

					<DropdownMenuItem
						className="focus:text-destructive-foreground focus:bg-destructive p-0"
						onSelect={e => e.preventDefault()}
					>
						<IpActionsButton
							ip={ip}
							type="purge"
							description="This action will delete ALL files uploaded by this IP. This action is not reversible."
						>
							Purge files
						</IpActionsButton>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
