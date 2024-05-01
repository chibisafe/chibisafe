'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Album } from '@/types';
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
import { FancyMultiSelect } from '@/components/FancyMultiSelect';
import request from '@/lib/request';
import { Skeleton } from '@/components/ui/skeleton';
import { customRevalidateTag } from '@/actions/utils';

export const BulkAlbumActions = ({
	uuids,
	isDrawer = false
}: {
	readonly isDrawer?: boolean | undefined;
	readonly uuids: string[];
}) => {
	const [open, setOpen] = useState(false);
	const [albums, setAlbums] = useState<Album[]>([]);
	const [allAlbums, setAllAlbums] = useState<Album[]>([]);
	const [ready, setReady] = useState(false);

	const getAllAlbums = useCallback(async () => {
		try {
			const { data, error } = await request.get({
				url: 'albums',
				query: { limit: 1000 },
				options: {
					next: {
						tags: ['albums']
					}
				}
			});
			if (error) {
				toast.error(error);
				return;
			}

			setAllAlbums(data.albums);
		} catch (error) {
			console.error(error);
		}
	}, []);

	const getAlbumsFromFiles = useCallback(async () => {
		try {
			const { data, error } = await request.post({
				url: 'files/albums',
				body: { files: uuids },
				options: {
					next: {
						tags: ['albums']
					}
				}
			});
			if (error) {
				toast.error(error);
				return;
			}

			setAlbums(data.albums);
		} catch (error) {
			console.error(error);
		}
	}, [uuids]);

	const addFilesToAlbum = useCallback(
		async (albumUuid: string) => {
			try {
				const { error } = await request.post({
					url: `files/album/${albumUuid}`,
					body: { files: uuids }
				});
				if (error) {
					toast.error(error);
					return;
				}

				customRevalidateTag('albums');
				customRevalidateTag('files');

				toast.success('Files added to album');
			} catch (error: any) {
				toast.error(error);
			}
		},
		[uuids]
	);

	const removeFilesFromAlbum = useCallback(
		async (albumUuid: string) => {
			try {
				const { error } = await request.post({
					url: `files/album/${albumUuid}/delete`,
					body: { files: uuids }
				});
				if (error) {
					toast.error(error);
					return;
				}

				customRevalidateTag('albums');
				customRevalidateTag('files');

				toast.success('Files removed from album');
			} catch (error) {
				console.error(error);
			}
		},
		[uuids]
	);

	useEffect(() => {
		if (open) {
			(async () => {
				await getAllAlbums();
				await getAlbumsFromFiles();
				setReady(true);
			})();
		}
	}, [open, getAlbumsFromFiles, getAllAlbums]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{isDrawer ? (
					<Button variant="destructive" className="w-full">
						Manage albums
					</Button>
				) : (
					<button type="button" className="w-full h-full flex px-2 py-1.5 cursor-default">
						Manage albums
					</button>
				)}
			</DialogTrigger>
			<DialogContent className="w-11/12">
				<DialogHeader>
					<DialogTitle>Add to album</DialogTitle>
					<DialogDescription>
						Use the dropdown below to select one or more albums to add the selected files to.{' '}
						<strong>Changes take action immediately.</strong>
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4">
					{ready ? (
						<FancyMultiSelect
							placeholder="Select album..."
							options={allAlbums.map(album => ({
								value: album.uuid,
								label: album.name
							}))}
							initialSelected={albums.map(album => album.uuid)}
							onSelected={async value => addFilesToAlbum(value)}
							onRemoved={async value => removeFilesFromAlbum(value)}
						/>
					) : (
						<Skeleton className="w-full h-10" />
					)}
				</div>
				<DialogFooter>
					<Button type="button" variant="secondary" onClick={() => setOpen(false)}>
						Close
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
