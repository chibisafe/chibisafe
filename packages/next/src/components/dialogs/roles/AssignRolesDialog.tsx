'use client';

import { useEffect, useState } from 'react';
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
import { assignRoles } from '@/actions/RoleActions';
import { FancyMultiSelect } from '@/components/FancyMultiSelect';
import { openAPIClient } from '@/lib/clientFetch';
import { Skeleton } from '@/components/ui/skeleton';

export function AssignRolesDialog({
	className,
	uuid,
	roles
}: {
	readonly className?: string;
	readonly roles: string[];
	readonly uuid: string;
}) {
	const [open, setOpen] = useState(false);
	const isMobile = useMediaQuery('(max-width: 768px)');

	// UI
	const buttonText = 'Assign roles';
	const formTitle = 'Assign roles to user';
	const formDescription = 'You can use this screen to assign roles to a user to give them specific permissions.';

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
					<Form uuid={uuid} roles={roles} onSuccess={() => setOpen(false)} />
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
				<Form uuid={uuid} roles={roles} onSuccess={() => setOpen(false)} />
			</DialogContent>
		</Dialog>
	);
}

type Role = {
	name: string;
	uuid: string;
};

const Form = ({ onSuccess, uuid, roles }: { onSuccess(): void; readonly roles: string[]; readonly uuid: string }) => {
	const [ready, setReady] = useState(false);
	const [selectedRoles, setSelectedRoles] = useState<string[]>(roles ?? []);
	const [allRoles, setAllRoles] = useState<Role[]>([]);

	const { formAction, isPending, state } = useServerAction({
		action: assignRoles,
		identifier: uuid,
		secondaryIdentifier: selectedRoles
	});

	useEffect(() => {
		if (state.type === MessageType.Success) {
			onSuccess?.();
		}

		const fetchData = async () => {
			const { data, error } = await openAPIClient.GET('/api/v1/roles/');
			if (error || !data.results) {
				return;
			}

			setAllRoles(
				data.results.map(role => ({
					name: role.name,
					uuid: role.uuid
				}))
			);

			setReady(true);
		};

		void fetchData();
	}, [onSuccess, state.type]);

	return (
		<form action={formAction}>
			<div className="flex flex-col gap-4 my-4">
				<div className="flex flex-col gap-2">
					{ready ? (
						// TODO: Change this multiselect site-wide
						<FancyMultiSelect
							placeholder="Search roles"
							options={
								allRoles
									?.filter(role => !selectedRoles.includes(role.uuid))
									.map(role => ({
										value: role.uuid,
										label: role.name
									})) ?? []
							}
							initialSelected={[]}
							onSelected={async value => setSelectedRoles(prev => [...prev, value])}
							onRemoved={async value => setSelectedRoles(prev => prev.filter(v => v !== value))}
						/>
					) : (
						<Skeleton className="w-full h-10" />
					)}
				</div>
			</div>
			<DialogFooter>
				<Button type="submit" disabled={isPending}>
					Change
				</Button>
			</DialogFooter>
		</form>
	);
};
