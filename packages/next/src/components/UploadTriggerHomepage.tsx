'use client';
import { UploadCloudIcon } from 'lucide-react';
import { UploadTrigger } from './UploadTrigger';
import { Button } from './ui/react-aria-button';
import { formatBytes } from '@/lib/file';
import type { Album, Settings } from '@/types';
import { currentUserAtom } from '@/lib/atoms/currentUser';
import { useAtomValue } from 'jotai';
import { buttonVariants } from '@/styles/button';
import { cn } from '@/lib/utils';
import { Combobox } from './Combobox';
import { useEffect, useState } from 'react';
import request from '@/lib/request';
import { toast } from 'sonner';

export const UploadTriggerHomepage = ({ settings }: { readonly settings: Settings }) => {
	const currentUser = useAtomValue(currentUserAtom);
	const [albums, setAlbums] = useState<Album[]>([]);
	const [isDisabled, setIsDisabled] = useState(true);
	const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);

	useEffect(() => {
		if (!settings?.publicMode && !currentUser?.uuid) {
			setIsDisabled(true);
			return;
		} else {
			setIsDisabled(false);
		}

		const fetchAlbums = async () => {
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
		};

		void fetchAlbums();
	}, [currentUser?.uuid, settings.publicMode]);

	return isDisabled ? (
		<div className="flex items-center justify-center w-2/3 mt-8">
			Uploading files without an account is currently disabled.
		</div>
	) : (
		<UploadTrigger allowsMultiple albumUuid={selectedAlbum ?? ''}>
			<div className="flex flex-col items-center justify-center w-3/6 h-40">
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
				<div className="-translate-y-5 bg-secondary rounded-lg">
					<Combobox
						data={albums.map(album => ({
							value: album.name,
							label: album.name
						}))}
						onSelected={value => setSelectedAlbum(albums.find(album => album.name === value)?.uuid ?? null)}
						placeholder="Select album..."
					/>
				</div>
			</div>
		</UploadTrigger>
	);
};
