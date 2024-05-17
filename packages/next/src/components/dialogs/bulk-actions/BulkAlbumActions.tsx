'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Album, FileWithIndex } from '@/types';
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
import { customRevalidateTag } from '@/actions/Revalidate';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FileWithAlbums {
	albums: Album[];
	uuid: string;
}

interface ModifiedFiles {
	[albumUuid: string]: FileWithIndex[];
}

export const BulkAlbumActions = ({
	files,
	isDrawer = false
}: {
	readonly files: FileWithIndex[];
	readonly isDrawer?: boolean | undefined;
}) => {
	const [open, setOpen] = useState(false);
	const [ready, setReady] = useState(false);
	const [isDirty, setIsDirty] = useState(false);

	const [allAlbums, setAllAlbums] = useState<Album[]>([]);

	const [dbFiles, setDbFiles] = useState<FileWithAlbums[]>([]);

	const [albumsToAdd, setAlbumsToAdd] = useState<ModifiedFiles>({});
	const [albumsToRemove, setAlbumsToRemove] = useState<ModifiedFiles>({});

	const [usedAlbums, setUsedAlbums] = useState<Album[]>([]);

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
				body: { files: files.map(file => file.uuid) },
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

			setDbFiles(data.files);
			setUsedAlbums(data.albums);
		} catch (error) {
			console.error(error);
		}
	}, [files]);

	const doAddFilesToAlbum = useCallback(async () => {
		const albums = Object.entries(albumsToAdd);
		try {
			const { error } = await request.post({
				url: `files/album/add`,
				body: albums.map(([album, files]) => ({ album, files: files.map(file => file.uuid) }))
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
	}, [albumsToAdd]);

	const doRemoveFilesFromAlbum = useCallback(async () => {
		const albums = Object.entries(albumsToRemove);

		try {
			const { error } = await request.post({
				url: `files/album/delete`,
				body: albums.map(([album, files]) => ({ album, files: files.map(file => file.uuid) }))
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
	}, [albumsToRemove]);

	const processFiles = useCallback(async () => {
		if (Object.keys(albumsToAdd).length) {
			await doAddFilesToAlbum();
		}

		if (Object.keys(albumsToRemove).length) {
			await doRemoveFilesFromAlbum();
		}

		customRevalidateTag('albums');
		customRevalidateTag('files');

		setAlbumsToAdd({});
		setAlbumsToRemove({});
		setIsDirty(false);
	}, [albumsToAdd, albumsToRemove, doAddFilesToAlbum, doRemoveFilesFromAlbum]);

	const addFilesToAlbum = useCallback(
		(albumUuid: string) => {
			const filesNotInAlbum = files.filter(file =>
				dbFiles
					.filter(file => !file.albums.some(album => album.uuid === albumUuid))
					.some(f => f.uuid === file.uuid)
			);
			setAlbumsToAdd(prev => ({ ...prev, [albumUuid]: filesNotInAlbum }));
			setUsedAlbums(prev => [...prev, allAlbums.find(el => el.uuid === albumUuid)!]);
			setIsDirty(true);
		},
		[allAlbums, dbFiles, files]
	);

	const removeFilesFromAlbum = useCallback(
		(albumUuid: string) => {
			const filesInAlbum = files.filter(file =>
				dbFiles
					.filter(file => file.albums.some(album => album.uuid === albumUuid))
					.some(f => f.uuid === file.uuid)
			);
			setAlbumsToRemove(prev => ({ ...prev, [albumUuid]: filesInAlbum }));
			setUsedAlbums(prev => prev.filter(album => album.uuid !== albumUuid));
			setIsDirty(true);
		},
		[dbFiles, files]
	);

	useEffect(() => {
		if (open) {
			(async () => {
				await getAllAlbums();
				await getAlbumsFromFiles();
				setReady(true);
			})();
		}

		return () => {
			setReady(false);
			setAlbumsToAdd({});
			setAlbumsToRemove({});
			setIsDirty(false);
		};
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
					<DialogTitle>Manage albums</DialogTitle>
					<DialogDescription>
						Use the dropdown below to select one or more albums to add the selected files to.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4">
					{ready ? (
						<>
							{isDirty ? (
								<div className="text-sm text-muted-foreground flex flex-col gap-2">
									<ScrollArea className="max-h-96">
										{Object.keys(albumsToAdd).length
											? Object.entries(albumsToAdd).map(([album, files]) =>
													files.length ? (
														<div key={album} className="flex flex-col gap-2">
															<p>
																{files.length} files will be added to the album{' '}
																<span className="font-bold">
																	{allAlbums.find(el => el.uuid === album)?.name}
																</span>
															</p>
															<ul className="text-green-800">
																{files.map(file => (
																	<li key={file.uuid}>
																		<a
																			href={file.url}
																			target="_blank"
																			rel="noreferrer noopener"
																		>
																			{file.name}
																		</a>
																	</li>
																))}
															</ul>
														</div>
													) : null
												)
											: null}
										{Object.keys(albumsToRemove).length
											? Object.entries(albumsToRemove).map(([album, files]) =>
													files.length ? (
														<div key={album} className="flex flex-col gap-2">
															<p>
																{files.length} files will be removed from the album{' '}
																<span className="font-bold">
																	{allAlbums.find(el => el.uuid === album)?.name}
																</span>
															</p>
															<ul className="text-red-800">
																{files.map(file => (
																	<li key={file.uuid}>
																		<a
																			href={file.url}
																			target="_blank"
																			rel="noreferrer noopener"
																		>
																			{file.name}
																		</a>
																	</li>
																))}
															</ul>
														</div>
													) : null
												)
											: null}
									</ScrollArea>
								</div>
							) : null}

							<FancyMultiSelect
								placeholder="Select album..."
								options={allAlbums.map(album => ({
									value: album.uuid,
									label: album.name
								}))}
								initialSelected={usedAlbums.map(album => album.uuid)}
								onSelected={async value => addFilesToAlbum(value)}
								onRemoved={async value => removeFilesFromAlbum(value)}
							/>
						</>
					) : (
						<Skeleton className="w-full h-10" />
					)}
				</div>
				<DialogFooter>
					<Button type="button" variant="secondary" onClick={() => setOpen(false)}>
						Close
					</Button>
					<Button type="button" variant="default" onClick={() => void processFiles()}>
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
