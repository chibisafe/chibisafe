'use client';

import { useEffect, type PropsWithChildren } from 'react';
import { updateAlbumSettings } from '@/actions/UpdateAlbumSettings';
import type { AlbumLink } from '@/types';
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
import { ScrollArea } from '@/components/ui/scroll-area';

import { AlbumSettingsDialogActions } from '../AlbumSettingsDialogActions';
import { AlbumLinksTable } from '../tables/album-links-table/AlbumLinksTable';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import request from '@/lib/request';
import { Plus } from 'lucide-react';

export function AlbumSettingsDialog({ children }: PropsWithChildren<{}>) {
	const [open, setOpen] = useAtom(isDialogOpenAtom);
	const album = useAtomValue(selectedAlbumAtom);
	const queryClient = useQueryClient();

	const [state, formAction] = useFormState(updateAlbumSettings, {
		message: '',
		type: MessageType.Uninitialized
	});

	const createNewAlbumLink = async () => {
		try {
			const { error } = await request.post({
				url: `album/${album?.uuid}/link`
			});

			if (error) {
				toast.error(error);
				return;
			}

			toast.success('Link created');
			void queryClient.invalidateQueries({ queryKey: ['albums', album?.uuid?.toString(), 'links'] });
		} catch (error: any) {
			toast.error(error);
		}
	};

	const { data, error } = useQuery<{ links: AlbumLink[] }>({
		queryKey: ['albums', album?.uuid, 'links'],
		enabled: Boolean(album?.uuid) && open,
		queryFn: async () => {
			const {
				data: response,
				error,
				status
			} = await request.get({
				url: `album/${album?.uuid}/links`,
				options: {
					next: {
						tags: ['album', album?.uuid.toString(), 'links']
					}
				}
			});

			if (error && status === 401) {
				throw new Error(error);
			}

			return response;
		}
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

	if (error) {
		toast.error(error.message);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="w-11/12">
				<ScrollArea className="max-h-[calc(100vh-12rem)]">
					<DialogHeader>
						<DialogTitle>Album settings</DialogTitle>
						<DialogDescription>Manage settings and create new public links</DialogDescription>
					</DialogHeader>

					<div className="flex flex-col gap-4">
						<form action={formAction} className="flex flex-col gap-4" id="album-settings">
							<input type="hidden" name="uuid" value={album?.uuid} />
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
									<p className="text-[0.8rem] text-muted-foreground">
										Activate if you want to blur the contents by default.
									</p>
								</div>
								<Switch id="nsfw" name="nsfw" defaultChecked={album?.nsfw ?? false} />
							</div>
						</form>
						<div>
							<Label htmlFor="description">Links</Label>
							<p className="text-[0.8rem] text-muted-foreground">
								A list of all the links created for this album. Each link is unique and will remain
								private unless you share it with the world.
							</p>

							<Button
								type="submit"
								variant="secondary"
								className="mt-2 mb-4"
								onClick={async () => createNewAlbumLink()}
							>
								<Plus className="mr-2 h-4 w-4" />
								Create new link
							</Button>

							<AlbumLinksTable data={data?.links} />
						</div>
					</div>
					<DialogFooter className="!place-content-between mt-4 gap-4">
						<AlbumSettingsDialogActions />
						<Button type="submit" form="album-settings">
							Save
						</Button>
					</DialogFooter>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
}
