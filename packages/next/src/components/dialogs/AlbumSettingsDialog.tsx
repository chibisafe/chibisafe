'use client';

import { useEffect, type PropsWithChildren } from 'react';
import { updateAlbumSettings } from '@/actions/UpdateAlbumSettings';
import { MessageType } from '@/types';
import { useAtom, useAtomValue } from 'jotai';
import { useFormState } from 'react-dom';
import { toast } from 'sonner';

import { isDialogOpenAtom, selectedAlbumAtom } from '@/lib/atoms/albumSettingsDialog';
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

import { AlbumSettingsDialogActions } from '../AlbumSettingsDialogActions';

export function AlbumSettingsDialog({ children }: PropsWithChildren<{}>) {
	const [open, setOpen] = useAtom(isDialogOpenAtom);
	const album = useAtomValue(selectedAlbumAtom);

	const [state, formAction] = useFormState(updateAlbumSettings, {
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
	}, [setOpen, state, state.message, state.type]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="">
				<form action={formAction}>
					<input type="hidden" name="uuid" value={album?.uuid} />
					<DialogHeader>
						<DialogTitle>Album settings</DialogTitle>
						<DialogDescription>Manage settings and create new public links</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col space-y-1.5 gap-2 my-4">
						<div>
							<Label htmlFor="name">Name</Label>
							<Input id="name" name="name" defaultValue={album?.name} />
						</div>
						<div>
							<Label htmlFor="description">Description</Label>
							<Textarea id="description" name="description" defaultValue={album?.description} />
						</div>
						<div className="space-y-2 flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
							<div className="space-y-0.5">
								<Label
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									htmlFor="nsfw"
								>
									NSFW Album
								</Label>
								<p id="" className="text-[0.8rem] text-muted-foreground">
									Activate if you want to blur the contents by default.
								</p>
							</div>
							<Switch id="nsfw" name="nsfw" defaultChecked={album?.nsfw ?? false} />
						</div>
					</div>
					<DialogFooter className="!justify-between">
						<AlbumSettingsDialogActions />
						<Button type="submit">Save</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
