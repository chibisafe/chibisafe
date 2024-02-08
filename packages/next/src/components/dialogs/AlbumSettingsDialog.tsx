'use client';

import { useEffect, useState, type PropsWithChildren } from 'react';
import { createAlbum } from '@/actions/CreateAlbum';
import { MessageType } from '@/types';
import { Plus } from 'lucide-react';
import { useFormState } from 'react-dom';
import { toast } from 'sonner';

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

export function AlbumSettingsDialog({ children }: PropsWithChildren<{}>) {
	const [open, setOpen] = useState(false);
	// const [state, formAction] = useFormState(createAlbum, {
	// 	message: '',
	// 	type: MessageType.Uninitialized
	// });

	// useEffect(() => {
	// 	if (state.type === MessageType.Error) toast.error(state.message);
	// 	else if (state.type === MessageType.Success) {
	// 		toast.success(state.message);
	// 		setOpen(false);
	// 	}
	// }, [state.message, state.type]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				{/* <form action={formAction}> */}
				<DialogHeader>
					<DialogTitle>Album settings</DialogTitle>
					<DialogDescription>Manage settings and create new public links</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="album" className="text-right">
							Name
						</Label>
						<Input id="album" name="album" placeholder="New album" className="col-span-3" />
					</div>
				</div>
				<DialogFooter>
					<Button type="submit">Create</Button>
				</DialogFooter>
				{/* </form> */}
			</DialogContent>
		</Dialog>
	);
}
