'use client';

import { useEffect, useState } from 'react';
import { MessageType } from '@/types';
import { Plus } from 'lucide-react';

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
import { createRole } from '@/actions/RoleActions';

export function CreateRoleDialog() {
	const [open, setOpen] = useState(false);
	const isMobile = useMediaQuery('(max-width: 768px)');

	// UI
	const buttonText = 'New role';
	const formTitle = 'Create new role';
	const formDescription =
		'Use this form to create a new role and be able to later assign permissions and storage quotas to it.';

	return isMobile ? (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					{buttonText}
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<div className="grid gap-1.5 py-4 px-8 text-center sm:text-left">
					<h2 className="text-lg font-semibold leading-none tracking-tight">{formTitle}</h2>
					<p className="text-sm text-muted-foreground">{formDescription}</p>
				</div>

				<div className="p-8">
					<Form onSuccess={() => setOpen(false)} />
				</div>
			</DrawerContent>
		</Drawer>
	) : (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					{buttonText}
				</Button>
			</DialogTrigger>
			<DialogContent className="w-11/12">
				<DialogHeader>
					<DialogTitle>{formTitle}</DialogTitle>
					<DialogDescription>{formDescription}</DialogDescription>
				</DialogHeader>
				<Form onSuccess={() => setOpen(false)} />
			</DialogContent>
		</Dialog>
	);
}

const Form = ({ onSuccess }: { onSuccess(): void }) => {
	const [name, setName] = useState('');

	const { formAction, isPending, state } = useServerAction({
		action: createRole,
		identifier: name
	});

	useEffect(() => {
		if (state.type === MessageType.Success) {
			onSuccess?.();
		}

		return () => {
			setName('');
		};
	}, [onSuccess, state.type]);

	return (
		<form action={formAction}>
			<div className="flex flex-col gap-4 my-4">
				<div className="flex flex-col gap-2">
					<Label htmlFor="name">Role</Label>
					<Input
						id="name"
						name="name"
						value={name}
						placeholder="New role name"
						onChange={event => setName(event.target.value)}
					/>
				</div>
			</div>
			<DialogFooter>
				<Button type="submit" disabled={isPending}>
					Create
				</Button>
			</DialogFooter>
		</form>
	);
};
