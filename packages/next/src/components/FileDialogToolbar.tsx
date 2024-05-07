import { DownloadIcon, GalleryThumbnailsIcon, LinkIcon, SquareArrowOutUpRight, Trash2Icon } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { Button } from './ui/button';
import type { PropsWithChildren } from 'react';
import type { FilePropsType, FileWithAdditionalData } from '@/types';
import { useCopyToClipboard } from 'usehooks-ts';
import { buttonVariants } from '@/styles/button';
import { regenerateThumbnail } from '@/actions/FileDialogActions';
import { toast } from 'sonner';
import { FileDialogInformation } from './FileDialogInformation';

export const FileDialogToolbar = ({
	file,
	type
}: PropsWithChildren<{ readonly file: FileWithAdditionalData; readonly type: FilePropsType }>) => {
	const [_, copy] = useCopyToClipboard();
	const regenerateThumbailWithUuid = regenerateThumbnail.bind(null, file.uuid);

	return (
		<div className="fixed md:-right-12 -top-12 h-10 z-[60] w-screen !pointer-events-auto bg-black flex flex-row justify-end items-center gap-4 md:gap-1 pr-2">
			<input type="text" className="opacity-0 pointer-events-none select-none" />
			<Tooltip content="Download">
				<a
					href={`/api/file/${file.uuid}/download`}
					rel="noopener noreferrer"
					className={buttonVariants({ variant: 'ghost', size: 'icon' })}
				>
					<DownloadIcon className="h-5 w-5" />
				</a>
			</Tooltip>

			{type === 'publicAlbum' ? null : <FileDialogInformation file={file} type={type} />}

			<Tooltip content="Open in new tab">
				<a
					href={file.url}
					target="_blank"
					rel="noopener noreferrer"
					className={buttonVariants({ variant: 'ghost', size: 'icon' })}
				>
					<SquareArrowOutUpRight className="h-5 w-5" />
				</a>
			</Tooltip>

			<Tooltip content="Copy link">
				<Button size={'icon'} variant={'ghost'} onClick={() => void copy(file.url)}>
					<LinkIcon className="h-5 w-5" />
				</Button>
			</Tooltip>

			{type === 'publicAlbum' ? null : (
				<>
					<Tooltip content="Regenerate thumbnail">
						<Button
							size={'icon'}
							variant={'ghost'}
							onClick={async () => {
								await regenerateThumbailWithUuid();
								toast.success('Thumbnail regenerated');
							}}
						>
							<GalleryThumbnailsIcon className="h-5 w-5" />
						</Button>
					</Tooltip>

					<Tooltip content="Delete">
						<Button size={'icon'} variant={'ghost'}>
							<Trash2Icon className="h-5 w-5" />
						</Button>
					</Tooltip>
				</>
			)}
		</div>
	);
};
