'use client';

import { useEffect, useState } from 'react';
import { MessageType } from '@/types';

import { Button } from '@/components/ui/button';
import { useServerAction } from '@/hooks/useServerAction';
import { assignRoles } from '@/actions/RoleActions';
import { FancyMultiSelect } from '@/components/FancyMultiSelect';
import { openAPIClient } from '@/lib/clientFetch';
import { Skeleton } from '@/components/ui/skeleton';
import { DialogContainer } from '@/components/dialogs/DialogContainer';

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
	return (
		<DialogContainer
			button={
				<button type="button" className={className}>
					Assign roles
				</button>
			}
			title="Assign roles to user"
			description="You can use this screen to assign roles to a user to give them specific permissions."
			open={open}
			onOpenChange={setOpen}
		>
			<Form onSuccess={() => setOpen(false)} uuid={uuid} roles={roles} />
		</DialogContainer>
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
						<FancyMultiSelect
							placeholder="Search roles"
							options={
								allRoles.map(role => ({
									value: role.uuid,
									label: role.name
								})) ?? []
							}
							initialSelected={selectedRoles}
							onSelected={async value => setSelectedRoles(prev => [...prev, value])}
							onRemoved={async value => setSelectedRoles(prev => prev.filter(v => v !== value))}
						/>
					) : (
						<Skeleton className="w-full h-10" />
					)}
				</div>
			</div>
			<div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
				<Button type="submit" disabled={isPending}>
					Change
				</Button>
			</div>
		</form>
	);
};
