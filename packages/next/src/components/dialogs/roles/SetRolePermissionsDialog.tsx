'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Role } from '@/types';
import { MessageType } from '@/types';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { useServerAction } from '@/hooks/useServerAction';
import { useMediaQuery } from 'usehooks-ts';
import { Drawer, DrawerContent, DrawerTrigger } from '../../ui/drawer';
import { setRolePermissions } from '@/actions/RoleActions';
import { Callout } from '@/components/mdx/Callout';
import { ScrollArea } from '@/components/ui/scroll-area';

export function SetRolePermissionsDialog({ className, role }: { readonly className?: string; readonly role: Role }) {
	const [open, setOpen] = useState(false);
	const isMobile = useMediaQuery('(max-width: 768px)');

	// UI
	const buttonText = 'Edit role permissions';
	const formTitle = 'Edit role permissions';
	const formDescription =
		'Use this form to edit the permissions for this role. Permissions control what actions users with this role can perform.';

	return isMobile ? (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<button type="button" className={className}>
					{buttonText}
				</button>
			</DrawerTrigger>
			<DrawerContent>
				<div className="grid gap-1.5 py-4 px-8 text-center sm:text-left">
					<h2 className="text-lg font-semibold leading-none tracking-tight">{formTitle}</h2>
					<p className="text-sm text-muted-foreground">{formDescription}</p>
				</div>

				<div className="p-8">
					<Form role={role} onSuccess={() => setOpen(false)} />
				</div>
			</DrawerContent>
		</Drawer>
	) : (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<button type="button" className={className}>
					{buttonText}
				</button>
			</DialogTrigger>
			<DialogContent className="w-11/12">
				<DialogHeader>
					<DialogTitle>{formTitle}</DialogTitle>
					<DialogDescription>{formDescription}</DialogDescription>
				</DialogHeader>
				<Form role={role} onSuccess={() => setOpen(false)} />
			</DialogContent>
		</Dialog>
	);
}

const permissions = [
	{
		name: 'canUploadFiles',
		label: 'Upload files',
		description: 'Allows users to upload files'
	},
	{
		name: 'canCreateFolders',
		label: 'Create folders',
		description: 'Allows users to create folders'
	},
	{
		name: 'canCreateFolderLinks',
		label: 'Create folder links',
		description: 'Allows users to create folder links'
	},
	{
		name: 'canCreateTags',
		label: 'Create tags',
		description: 'Allows users to create tags'
	},
	{
		name: 'canCreateSnippets',
		label: 'Create snippets',
		description: 'Allows users to create snippets'
	},
	{
		name: 'canManageFiles',
		label: 'Manage files',
		description: 'Allows users to manage files'
	},
	{
		name: 'canManageFolders',
		label: 'Manage folders',
		description: 'Allows users to manage folders'
	},
	{
		name: 'canManageTags',
		label: 'Manage tags',
		description: 'Allows users to manage tags'
	},
	{
		name: 'canManageSnippets',
		label: 'Manage snippets',
		description: 'Allows users to manage snippets'
	},
	{
		name: 'canManageSettings',
		label: 'Manage settings',
		description: 'Allows users to manage settings'
	},
	{
		name: 'canManageRoles',
		label: 'Manage roles',
		description: 'Allows users to manage roles'
	},
	{
		name: 'canManageUsers',
		label: 'Manage users',
		description: 'Allows users to manage users'
	},
	{
		name: 'canManageIPBans',
		label: 'Manage IP bans',
		description: 'Allows users to manage IP bans'
	}
];

const Form = ({ onSuccess, role }: { onSuccess(): void; readonly role: Role }) => {
	const [data, setData] = useState({
		canUploadFiles: role.permissions?.canUploadFiles ?? false,
		canCreateFolders: role.permissions?.canCreateFolders ?? false,
		canCreateFolderLinks: role.permissions?.canCreateFolderLinks ?? false,
		canCreateTags: role.permissions?.canCreateTags ?? false,
		canCreateSnippets: role.permissions?.canCreateSnippets ?? false,
		canManageFiles: role.permissions?.canManageFiles ?? false,
		canManageFolders: role.permissions?.canManageFolders ?? false,
		canManageTags: role.permissions?.canManageTags ?? false,
		canManageSnippets: role.permissions?.canManageSnippets ?? false,
		canManageSettings: role.permissions?.canManageSettings ?? false,
		canManageRoles: role.permissions?.canManageRoles ?? false,
		canManageUsers: role.permissions?.canManageUsers ?? false,
		canManageIPBans: role.permissions?.canManageIPBans ?? false
	});

	const { formAction, isPending, state } = useServerAction({
		action: setRolePermissions,
		identifier: role.uuid,
		secondaryIdentifier: JSON.stringify(data)
	});

	const handleInputChange = useCallback(
		(e: any) => {
			if (e.target.type === 'checkbox') {
				setData({
					...data,
					[e.target.name]: e.target.checked
				});
			} else {
				setData({ ...data, [e.target.name]: e.target.value });
			}
		},
		[data]
	);

	useEffect(() => {
		if (state.type === MessageType.Success) {
			onSuccess?.();
		}
	}, [onSuccess, state.type]);

	return (
		<form action={formAction}>
			<div className="flex flex-col gap-4 my-4">
				<Callout type="danger" className="my-0">
					<p className="text-sm">
						Permissions labeled as <span className="underline">manage</span> are administrative. They allow
						a role to access and modify other users' data. Make sure you fully understand the consequences
						of granting these permissions.
					</p>
				</Callout>
				<ScrollArea className="h-96">
					<div className="flex flex-col gap-2">
						{permissions.map(permission => (
							<div key={permission.name} className="items-top flex space-x-2">
								<input
									type="checkbox"
									id={permission.name}
									name={permission.name}
									onChange={handleInputChange}
									className="h-4 w-4"
									// @ts-expect-error types
									checked={data[permission.name]}
								/>
								<div className="grid gap-1.5 leading-none">
									<label
										htmlFor={permission.name}
										className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									>
										{permission.label}
									</label>
									<p className="text-sm text-muted-foreground">{permission.description}</p>
								</div>
							</div>
						))}
					</div>
				</ScrollArea>
			</div>
			<DialogFooter>
				<Button type="submit" disabled={isPending}>
					Change
				</Button>
			</DialogFooter>
		</form>
	);
};
