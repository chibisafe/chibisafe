'use client';

import { useCallback, useEffect, useState, type PropsWithChildren } from 'react';
import type { Album as AlbumType, FilePropsType, FileWithAdditionalData, Tag } from '@/types';
import type { DialogProps } from '@radix-ui/react-dialog';
import dayjs from 'dayjs';
import {
	MediaControlBar,
	MediaController,
	MediaFullscreenButton,
	MediaMuteButton,
	MediaPipButton,
	MediaPlaybackRateButton,
	MediaPlayButton,
	MediaTimeDisplay,
	MediaTimeRange,
	MediaVolumeRange
} from 'media-chrome/dist/react';

import { formatBytes, isFileAudio, isFileImage, isFileVideo } from '@/lib/file';
import request from '@/lib/request';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FancyMultiSelect } from '@/components/FancyMultiSelect';
import { FileInformationDialogActions } from '@/components/FileInformationDialogActions';
import { FileInformationDrawerActions } from '@/components/FileInformationDrawerActions';
import { ArrowUpRightFromSquare, FileQuestionIcon } from 'lucide-react';
import { Badge } from '../ui/badge';

export function FileInformationDialog({
	file,
	type,
	isOpen = false,
	onOpenChange = () => {}
}: PropsWithChildren<{
	readonly file: FileWithAdditionalData;
	readonly isOpen: DialogProps['open'];
	readonly onOpenChange: DialogProps['onOpenChange'];
	readonly type: FilePropsType;
}>) {
	const [albums, setAlbums] = useState<AlbumType[]>([]);
	const [tags, setTags] = useState<Tag[]>([]);
	const [fileAlbums, setFileAlbums] = useState<AlbumType[]>([]);
	const [fileTags, setFileTags] = useState<Tag[]>([]);

	const fetchExtraData = useCallback(async () => {
		try {
			if (type === 'admin') return;

			const createdAlbums = await request.get('albums');
			setAlbums(createdAlbums.albums);

			const albumsTags = await request.get('tags');
			setTags(albumsTags.tags);

			const fileInfo = await request.get(`file/${file.uuid}`);
			setFileAlbums(fileInfo.file.albums);
			setFileTags(fileInfo.file.tags);
		} catch (error) {
			console.error(error);
		}
	}, [file.uuid, type]);

	useEffect(() => {
		if (isOpen) void fetchExtraData();
	}, [isOpen, fetchExtraData]);

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent
				className={cn(
					// isVertical ? '!w-fit' : '!w-max',
					'max-w-[calc(100vw-8rem)] max-h-[calc(100vh-8rem)] min-h-[calc(100vh-11rem)] !w-max p-0'
				)}
			>
				<div className="absolute right-0 -bottom-12 z-10 md:inline-block hidden">
					<FileInformationDialogActions file={file} type={type} />
				</div>

				<div className="absolute right-0 -bottom-12 z-10 md:hidden inline-block">
					<FileInformationDrawerActions file={file} type={type} />
				</div>

				<Tabs
					defaultValue={
						isFileImage(file) || isFileAudio(file) || isFileVideo(file) ? 'preview' : 'information'
					}
					className="relative"
				>
					<div className="flex justify-center w-full absolute -top-12">
						<TabsList>
							<TabsTrigger value="preview">Preview</TabsTrigger>
							<TabsTrigger value="information">Information</TabsTrigger>
						</TabsList>
					</div>
					<TabsContent value="preview" className="mt-0">
						<div className={cn('h-[calc(100vh-11rem)]', 'w-full')}>
							{isFileImage(file) ? (
								<picture>
									<img src={file.url} className="h-full object-contain md:block" />
								</picture>
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
								<span className="text-light-100 h-full items-center hidden md:flex px-8 flex-col justify-center gap-4">
									<FileQuestionIcon className="w-16 h-16" />
									Sorry but this filetype can't be previewed at this time.
								</span>
							)}
						</div>
					</TabsContent>
					<TabsContent value="information">
						{isFileImage(file) ? (
							<picture>
								<img
									src={file.url}
									className="h-auto hidden absolute -top-px -left-[272px] xl:block border bg-background p-2 shadow-lg sm:rounded-lg max-w-[264px]"
								/>
							</picture>
						) : isFileVideo(file) ? (
							<video
								className="h-auto hidden absolute -top-px -left-[272px] xl:block border bg-background p-2 shadow-lg sm:rounded-lg max-w-[264px]"
								autoPlay
								loop
								muted
							>
								<source src={file.preview} type="video/mp4" />
							</video>
						) : null}
						<ScrollArea className="max-h-[calc(100vh-8rem)] w-full">
							<div className={cn('grid grid-rows-1 gap-8 md:p-8 p-2 min-w-96 md:grid-cols-2')}>
								<div className="flex flex-col space-y-1.5 gap-0">
									<h2 className="text-2xl font-semibold leading-none tracking-tight mb-4">
										File information
									</h2>

									<div>
										<Label htmlFor="uuid">UUID</Label>
										<Input value={file.uuid} name="uuid" id="uuid" readOnly />
									</div>

									<div>
										<Label htmlFor="name">Name</Label>
										<Input value={file.name} name="name" id="name" readOnly />
									</div>

									<div>
										<Label htmlFor="original">Original</Label>
										<Input value={file.original} name="original" id="original" readOnly />
									</div>

									<div>
										<Label htmlFor="ip">
											IP{' '}
											{type === 'admin' ? (
												<a
													href={`/dashboard/admin/ip/${file.ip}`}
													className="text-blue-500 underline inline-flex items-center ml-2"
												>
													view files <ArrowUpRightFromSquare className="w-3 h-3 ml-1" />
												</a>
											) : null}
										</Label>
										<Input value={file.ip} name="ip" id="ip" readOnly />
									</div>

									<div>
										<Label htmlFor="url">URL</Label>
										<Input value={file.url} name="url" id="url" readOnly />
									</div>

									<div>
										<Label htmlFor="size">Size</Label>
										<Input value={formatBytes(file.size)} name="size" id="size" readOnly />
									</div>

									<div>
										<Label htmlFor="hash">Hash</Label>
										<Input value={file.hash} name="hash" id="hash" readOnly />
									</div>

									<div>
										<Label htmlFor="uploaded">Uploaded</Label>
										<Input
											value={dayjs(file.createdAt).format('MMMM D, YYYY h:mm A')}
											name="uploaded"
											id="uploaded"
											readOnly
										/>
									</div>
								</div>

								{type === 'admin' && file.user ? (
									<div className="flex flex-col space-y-1.5 gap-0">
										<h2 className="text-2xl font-semibold leading-none tracking-tight mb-4">
											User information
										</h2>

										<div>
											<Label htmlFor="owner">
												Owner
												<a
													href={`/dashboard/admin/user/${file.user?.uuid}`}
													className="text-blue-500 underline inline-flex items-center ml-2"
												>
													view files <ArrowUpRightFromSquare className="w-3 h-3 ml-1" />
												</a>
											</Label>
											<Input value={file.user.username} name="owner" id="owner" readOnly />
										</div>

										<div>
											<Label htmlFor="userUUID">User UUID</Label>
											<Input value={file.user?.uuid} name="userUUID" id="userUUID" readOnly />
										</div>

										<div>
											<Label htmlFor="status">Status</Label>
											<Input
												value={file.user.enabled ? 'Enabled' : 'Disabled'}
												name="status"
												id="status"
												readOnly
											/>
										</div>

										<div>
											<Label htmlFor="null">Roles</Label>
											<div>
												{file.user.roles.map((role: any) => (
													<Badge key={role.name} className="mr-1">
														{role.name}
													</Badge>
												))}
											</div>
										</div>

										<div>
											<Label htmlFor="joined">Joined</Label>
											<Input
												value={dayjs(file.user.createdAt).format('MMMM D, YYYY h:mm A')}
												name="joined"
												id="joined"
												readOnly
											/>
										</div>
									</div>
								) : (
									<div className="max-w-96">
										<div className="flex flex-col space-y-1.5 gap-0">
											<h2 className="text-2xl font-semibold leading-none tracking-tight mb-4">
												Albums
											</h2>
											<div>
												<Label htmlFor="albums">Add albums</Label>
												<div className="font-light text-xs px-2 my-2 border-l-2 border-blue-500">
													A file can be added to multiple albums.
												</div>
												<FancyMultiSelect
													name="albums"
													placeholder="Select album..."
													options={
														albums
															? albums.map(album => ({
																	value: album.uuid,
																	label: album.name
																}))
															: []
													}
													initialSelected={fileAlbums.map(album => album.uuid)}
												/>
											</div>
										</div>
										<div className="flex flex-col space-y-1.5 gap-0 mt-8">
											<h2 className="text-2xl font-semibold leading-none tracking-tight mb-4">
												Tags
											</h2>
											<div>
												<Label htmlFor="tags">Attach tags</Label>
												<div className="font-light text-xs px-2 my-2 border-l-2 border-blue-500">
													To create a new tag you can type the name of the tag and press enter
													and it will be attached to the file automatically.
												</div>

												<FancyMultiSelect
													name="tags"
													placeholder="Select tags..."
													options={
														tags
															? tags.map(tag => ({
																	value: tag.uuid,
																	label: tag.name
																}))
															: []
													}
													initialSelected={fileTags.map(tag => tag.uuid)}
												/>
											</div>
										</div>
									</div>
								)}
							</div>
						</ScrollArea>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
