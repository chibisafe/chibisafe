'use client';

import { useRef, useState } from 'react';
import type { FilePropsType, FileWithAdditionalData } from '@/types';
import {
	MediaControlBar,
	MediaController,
	MediaFullscreenButton,
	MediaMuteButton,
	MediaPipButton,
	MediaPlayButton,
	MediaPlaybackRateButton,
	MediaTimeDisplay,
	MediaTimeRange,
	MediaVolumeRange
} from 'media-chrome/dist/react';

import { isFileAudio, isFileImage, isFileVideo } from '@/lib/file';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { FileInformationDialogActions } from '@/components/FileInformationDialogActions';

export function FileInformationDialog({
	file,
	type
}: {
	readonly file: FileWithAdditionalData;
	readonly type: FilePropsType;
}) {
	const ref = useRef<HTMLButtonElement>(null);
	const image = useRef<HTMLImageElement>(null);
	const [isVerticalImage, setIsVerticalImage] = useState(false);

	const onImageLoad = () => {
		if (!image.current) return;
		setIsVerticalImage(image.current.naturalHeight > image.current.naturalWidth);
		// TODO: We already know if the image is vertical or not thanks to the thumbnail
		// so we can just use that instead of checking the naturalHeight and naturalWidth
	};

	return (
		<Dialog>
			<DialogTrigger ref={ref} className="w-full h-full absolute pointer-events-none">
				<a
					className="w-full h-full absolute top-0 left-0 pointer-events-auto"
					href={file.url}
					target="_blank"
					rel="noopener noreferrer"
					onClick={e => {
						e.preventDefault();
						e.stopPropagation();
						ref.current?.click();
					}}
				/>
			</DialogTrigger>
			<DialogContent
				className={cn(
					isVerticalImage ? '!w-fit' : '!w-max',
					'max-w-[calc(100vw-8rem)] max-h-[calc(100vh-8rem)] min-h-[calc(100vh-8rem)]'
				)}
			>
				<div className="grid grid-cols-[1fr,400px] gap-4">
					<div
						className={cn(
							isFileImage(file) || isFileVideo(file) ? 'h-[calc(100vh-11rem)]' : 'h-auto',
							'w-full'
						)}
					>
						{isFileImage(file) ? (
							// eslint-disable-next-line @next/next/no-img-element
							<img
								src={file.url}
								className="h-full object-contain hidden md:block"
								ref={image}
								onLoad={() => onImageLoad}
							/>
						) : isFileVideo(file) ? (
							<MediaController className="h-full hidden md:block">
								<video slot="media" src={file.url} crossOrigin="" className="h-full" />
								<MediaControlBar>
									<MediaPlayButton />
									<MediaMuteButton />
									<MediaVolumeRange />
									<MediaTimeRange />
									<MediaPipButton />
									<MediaFullscreenButton />
								</MediaControlBar>
							</MediaController>
						) : isFileAudio(file) ? (
							<MediaController className="h-full hidden md:block">
								<audio slot="media" src={file.url} crossOrigin="" />
								<MediaControlBar>
									<MediaPlayButton />
									<MediaTimeDisplay showDuration />
									<MediaTimeRange />
									<MediaPlaybackRateButton />
									<MediaMuteButton />
									<MediaVolumeRange />
								</MediaControlBar>
							</MediaController>
						) : (
							<span className="text-light-100 h-full items-center hidden md:flex">
								Sorry but this file can't be previewed at this time.
							</span>
						)}
					</div>
				</div>
				<div>
					<FileInformationDialogActions />
				</div>
			</DialogContent>
		</Dialog>
	);
}
