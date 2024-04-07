'use client';

import { useEffect, useState } from 'react';
import { MessageType } from '@/types';
import { Plus } from 'lucide-react';
import { useFormState } from 'react-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Input } from '../ui/input';
import { createAlbum } from '@/actions/CreateAlbum';

export function CreateAlbumDrawer({ className }: { readonly className?: string }) {
	const [open, setOpen] = useState(false);
	const [state, formAction] = useFormState(createAlbum, {
		message: '',
		type: MessageType.Uninitialized
	});

	useEffect(() => {
		if (state.type === MessageType.Error) toast.error(state.message);
		else if (state.type === MessageType.Success) {
			toast.success(state.message);
			setOpen(false);
		}

		return () => {
			if (state.type === MessageType.Success) {
				state.type = MessageType.Uninitialized;
				state.message = '';
			}
		};
	}, [state, state.message, state.type]);

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button className={className}>
					<Plus className="mr-2 h-4 w-4" />
					New album
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<div className="grid gap-1.5 py-4 px-8 text-center sm:text-left">
					<h2 className="text-lg font-semibold leading-none tracking-tight">New album</h2>
					<p className="text-sm text-muted-foreground">Create a new album</p>
				</div>

				<form action={formAction}>
					<div className="grid gap-4 py-4 px-8">
						<div className="grid gap-4">
							<div>
								<Label htmlFor="album" className="text-right">
									Name
								</Label>
								<Input id="album" name="album" placeholder="New album name" className="col-span-3" />
							</div>
						</div>
						<Button type="submit" className="mb-4 w-full">
							Create
						</Button>
					</div>
				</form>
			</DrawerContent>
		</Drawer>
	);
}
