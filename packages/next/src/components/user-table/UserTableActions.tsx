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

import { ConfirmationAction } from './ConfirmationAction';
import type { UserWithCount } from '@/types';

export function UserTableActions({ user }: PropsWithChildren<{ readonly user: UserWithCount }>) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="secondary">Actions</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuGroup>
					<DropdownMenuItem>View files</DropdownMenuItem>
					<DropdownMenuItem onSelect={e => e.preventDefault()}>Set quota</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					{user.enabled ? (
						<DropdownMenuItem className="p-0" onSelect={e => e.preventDefault()}>
							<ConfirmationAction
								uuid={user.uuid}
								type="disable"
								description="This action will disable the user and thus prevent them from logging into chibisafe again until you enable them once more. All uploaded files and albums will remain intact."
							>
								Disable
							</ConfirmationAction>
						</DropdownMenuItem>
					) : (
						<DropdownMenuItem className="p-0" onSelect={e => e.preventDefault()}>
							<ConfirmationAction
								uuid={user.uuid}
								type="enable"
								description="This action will enable the user and allow them to log into chibisafe again. They'll be able to access all previous uploads and albums."
							>
								Enable
							</ConfirmationAction>
						</DropdownMenuItem>
					)}
					{user.roles.some(role => role.name === 'admin') ? (
						<DropdownMenuItem
							className="focus:text-destructive-foreground focus:bg-destructive p-0"
							onSelect={e => e.preventDefault()}
						>
							<ConfirmationAction
								uuid={user.uuid}
								type="demote"
								description="This action will remove the admin role and demote the user back to a normal user."
							>
								Demote
							</ConfirmationAction>
						</DropdownMenuItem>
					) : (
						<DropdownMenuItem className="p-0" onSelect={e => e.preventDefault()}>
							<ConfirmationAction
								uuid={user.uuid}
								type="promote"
								description="This action will promote the user to admin. They'll be able to do everything you can do. Be careful before promoting anyone to understand the risks."
							>
								Promote
							</ConfirmationAction>
						</DropdownMenuItem>
					)}
					<DropdownMenuItem
						className="focus:text-destructive-foreground focus:bg-destructive p-0"
						onSelect={e => e.preventDefault()}
					>
						<ConfirmationAction
							uuid={user.uuid}
							type="purge"
							description="This action will delete ALL files, albums, tags and snippets created by the user. This action is not reversible."
						>
							Purge
						</ConfirmationAction>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
