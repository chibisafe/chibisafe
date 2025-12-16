'use client';
import { UploadCloudIcon } from 'lucide-react';
import { UploadTrigger } from './UploadTrigger';
import { Button } from './ui/react-aria-button';
import { Button as ShadcnButton } from './ui/button';
import { formatBytes } from '@/lib/file';
import type { Album, Settings } from '@/types';
import { currentUserAtom } from '@/lib/atoms/currentUser';
import { uploadAlbumUuidAtom } from '@/lib/atoms/selectedAlbum';
import { useAtomValue, useSetAtom } from 'jotai';
import { buttonVariants } from '@/styles/button';
import { cn } from '@/lib/utils';
import { Combobox } from './Combobox';
import { useEffect, useState, useCallback } from 'react';
import request from '@/lib/request';
import { toast } from 'sonner';
import { createAlbumAndReturn } from '@/actions/CreateAlbumAndReturn';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const UploadTriggerHomepage = ({ settings }: { readonly settings: Settings }) => {
	const currentUser = useAtomValue(currentUserAtom);
	const uploadAlbumUuid = useAtomValue(uploadAlbumUuidAtom);
	const setUploadAlbumUuid = useSetAtom(uploadAlbumUuidAtom);
	const [albums, setAlbums] = useState<Album[]>([]);
	const [isDisabled, setIsDisabled] = useState(true);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [newAlbumName, setNewAlbumName] = useState('');
	const [isCreating, setIsCreating] = useState(false);

	const fetchAlbums = useCallback(async () => {
		if (!currentUser?.uuid) return;

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

		setAlbums(data.albums);
	}, [currentUser?.uuid]);

	useEffect(() => {
		if (!settings?.publicMode && !currentUser?.uuid) {
			setIsDisabled(true);
			return;
		} else {
			setIsDisabled(false);
		}

		if (currentUser?.uuid) {
			setIsLoggedIn(true);
		}

		void fetchAlbums();
	}, [currentUser?.uuid, settings.publicMode, fetchAlbums]);

	const handleCreateAlbum = useCallback(async () => {
		if (!newAlbumName.trim()) {
			toast.error('Album name is required');
			return;
		}

		setIsCreating(true);
		const result = await createAlbumAndReturn(newAlbumName.trim());
		setIsCreating(false);

		if (result.error) {
			toast.error(result.error);
			return;
		}

		if (result.album) {
			await fetchAlbums();
			setUploadAlbumUuid(result.album.uuid);
			toast.success('Album created');
			setIsCreateDialogOpen(false);
			setNewAlbumName('');
		}
	}, [newAlbumName, setUploadAlbumUuid, fetchAlbums]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				void handleCreateAlbum();
			}
		},
		[handleCreateAlbum]
	);

	return isDisabled ? (
		<div className="flex items-center justify-center w-2/3 mt-8">
			Uploading files without an account is currently disabled.
		</div>
	) : (
		<>
		<UploadTrigger allowsMultiple albumUuid={uploadAlbumUuid ?? ''}>
			<div className="flex flex-col items-center justify-center sm:w-3/6 h-40 w-full">
				<div
					className={cn(
						buttonVariants({ variant: 'outline' }),
						'relative h-full w-full transition-colors flex flex-col justify-center items-center bg-background-transparent'
					)}
				>
					<label className="flex flex-col items-center justify-center w-full cursor-pointer">
						<Button className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
							<UploadCloudIcon className="h-10 w-10" />
							<p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
								<span className="font-semibold">Click to upload</span> or drag and drop anywhere
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								{formatBytes(settings?.maxSize ?? 0)} max per file
							</p>
						</Button>
					</label>
				</div>
				{isLoggedIn && (
					<div className="-translate-y-5 bg-secondary rounded-lg">
						<Combobox
							data={albums.map(album => ({
								value: album.uuid,
								label: album.name
							}))}
							onSelected={uuid => {
								setUploadAlbumUuid(uuid || null);
							}}
							placeholder="Select album..."
							createNewLabel="Create new album"
							onCreateNew={() => setIsCreateDialogOpen(true)}
							selectedValue={uploadAlbumUuid ?? ''}
						/>
					</div>
				)}
			</div>

		</UploadTrigger>

		<Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
			<DialogContent className="w-11/12 sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Create new album</DialogTitle>
					<DialogDescription>Enter a name for your new album</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="albumName" className="text-right">
							Name
						</Label>
						<Input
							id="albumName"
							value={newAlbumName}
							onChange={e => setNewAlbumName(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder="Album name"
							className="col-span-3"
							autoFocus
						/>
					</div>
				</div>
				<DialogFooter>
					<ShadcnButton onClick={() => void handleCreateAlbum()} disabled={isCreating}>
						{isCreating ? 'Creating...' : 'Create'}
					</ShadcnButton>
				</DialogFooter>
			</DialogContent>
		</Dialog>
		</>
	);
};
