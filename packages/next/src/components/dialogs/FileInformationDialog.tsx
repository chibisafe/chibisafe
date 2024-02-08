import { ReactEventHandler, useRef, useState, type PropsWithChildren } from 'react';
import type { FilePropsType, FileWithAdditionalData } from '@/types';
import type { DialogProps } from '@radix-ui/react-dialog';
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
	// children,
	file,
	type,
	// isVertical = false,
	isOpen = false,
	onOpenChange = () => {}
}: PropsWithChildren<{
	readonly file: FileWithAdditionalData;
	readonly isOpen: DialogProps['open'];
	// readonly isVertical?: boolean | undefined;
	readonly onOpenChange: DialogProps['onOpenChange'];
	readonly type: FilePropsType;
}>) {
	// const ref = useRef<HTMLButtonElement>(null);
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			{/* <DialogTrigger ref={ref} className="w-full h-full absolute pointer-events-none">
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
			</DialogTrigger> */}
			{/* {children} */}
			<DialogContent
				className={cn(
					// isVertical ? '!w-fit' : '!w-max',
					'max-w-[calc(100vw-8rem)] max-h-[calc(100vh-8rem)] min-h-[calc(100vh-8rem)] !w-max'
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
							<img src={file.url} className="h-full object-contain hidden md:block" />
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
