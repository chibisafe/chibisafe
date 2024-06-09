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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useServerAction } from '@/hooks/useServerAction';
import { useMediaQuery } from 'usehooks-ts';
import { Drawer, DrawerContent, DrawerTrigger } from '../../ui/drawer';
import { setRoleQuota } from '@/actions/RoleActions';
import { formatBytes } from '@/lib/file';

export function SetRoleQuotaDialog({ className, uuid }: { readonly className?: string; readonly uuid: string }) {
	const [open, setOpen] = useState(false);
	const isMobile = useMediaQuery('(max-width: 768px)');

	// UI
	const buttonText = 'Edit role quota';
	const formTitle = 'Edit role quota';
	const formDescription =
		'Use this form to edit the storage quota for this role. The quota is the maximum amount of storage that can be used by all users with this role.';

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
					<Form uuid={uuid} onSuccess={() => setOpen(false)} />
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
				<Form uuid={uuid} onSuccess={() => setOpen(false)} />
			</DialogContent>
		</Dialog>
	);
}

const Form = ({ onSuccess, uuid }: { onSuccess(): void; readonly uuid: string }) => {
	const [quota, setQuota] = useState(0);

	const { formAction, isPending, state } = useServerAction({
		action: setRoleQuota,
		identifier: uuid,
		secondaryIdentifier: String(quota)
	});

	useEffect(() => {
		if (state.type === MessageType.Success) {
			onSuccess?.();
		}

		return () => {
			setQuota(0);
		};
	}, [onSuccess, state.type]);

	return (
		<form action={formAction}>
			<div className="flex flex-col gap-4 my-4">
				<div className="flex flex-col gap-2">
					<Label htmlFor="name">Allocated space for role</Label>
					<Input
						id="quota"
						name="quota"
						type="number"
						value={quota}
						placeholder="Quota"
						onChange={event => setQuota(Number.parseInt(event.target.value, 10) || 0)}
					/>
					<p className="text-muted-foreground text-sm">{formatBytes(quota)}</p>
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
