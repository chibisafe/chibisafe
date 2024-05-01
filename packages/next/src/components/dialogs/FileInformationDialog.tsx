'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Album as AlbumType, Tag } from '@/types';
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
import { ArrowUpRightFromSquare, ChevronLeft, ChevronRight, Loader2Icon } from 'lucide-react';
import { Badge } from '../ui/badge';
import Link from 'next/link';
import { getDate } from '@/lib/time';
import { toast } from 'sonner';
import { useAtom, useAtomValue } from 'jotai';
import { currentTypeAtom, isDialogOpenAtom, selectedFileAtom, allFilesAtom } from '@/lib/atoms/fileInformationDialog';
import { FileTextViewer } from '../FileTextViewer';
import { useEventListener } from 'usehooks-ts';
import { useZoomImageWheel } from '@zoom-image/react';

export function FileInformationDialog() {
	const [selectedFile, setSelectedFile] = useAtom(selectedFileAtom);
	const allFiles = useAtomValue(allFilesAtom);
	const currentType = useAtomValue(currentTypeAtom);
	const [albums, setAlbums] = useState<AlbumType[]>([]);
	const [tags, setTags] = useState<Tag[]>([]);
	const [fileAlbums, setFileAlbums] = useState<AlbumType[]>([]);
	const [fileTags, setFileTags] = useState<Tag[]>([]);
	const [tab, setTab] = useState('preview');
	const [isModalOpen, setModalOpen] = useAtom(isDialogOpenAtom);
	const [touchStart, setTouchStart] = useState<Number | null>(null);
	const [touchEnd, setTouchEnd] = useState<Number | null>(null);
	const [loading, setLoading] = useState(true);
	const imageZoomContainerRef = useRef<HTMLDivElement>(null);
	const { createZoomImage, setZoomImageState } = useZoomImageWheel();

	const swipeDistanceToTrigger = 50;

	const fetchFileInfo = useCallback(async () => {
		try {
			const { data: response, error } = await request.get({ url: `file/${selectedFile?.uuid}` });
			if (error) {
				toast.error(error);
				return;
			}

			setFileAlbums(response.file.albums);
			setFileTags(response.file.tags);
		} catch (error) {
			console.error(error);
		}
	}, [selectedFile?.uuid]);

	const fetchAllTags = useCallback(async () => {
		try {
			const { data: response, error } = await request.get({ url: 'tags' });
			setTags(response.tags);
			if (error) {
				toast.error(error);
			}
		} catch (error) {
			console.error(error);
		}
	}, []);

	const fetchExtraData = useCallback(async () => {
		try {
			if (currentType === 'admin') return;
			if (currentType === 'publicAlbum') return;
			if (currentType === 'quarantine') return;

			const { data: createdAlbums, error: createdAlbumError } = await request.get({
				url: 'albums',
				query: { limit: 1000 },
				options: {
					next: {
						tags: ['albums']
					}
				}
			});
			if (createdAlbumError) {
				toast.error(createdAlbumError);
				return;
			}

			setAlbums(createdAlbums.albums);

			void fetchAllTags();
			void fetchFileInfo();
		} catch (error) {
			console.error(error);
		}
	}, [fetchAllTags, fetchFileInfo, currentType]);

	const addFileToAlbum = useCallback(
		async (albumUuid: string) => {
			try {
				const { error } = await request.post({
					url: `file/${selectedFile?.uuid}/album/${albumUuid}`
				});
				if (error) {
					toast.error(error);
					return;
				}

				toast.success('File added to album');
			} catch (error: any) {
				toast.error(error);
			}
		},
		[selectedFile?.uuid]
	);

	const removeFileFromAlbum = useCallback(
		async (albumUuid: string) => {
			try {
				const { error } = await request.delete({
					url: `file/${selectedFile?.uuid}/album/${albumUuid}`
				});
				if (error) {
					toast.error(error);
					return;
				}

				toast.success('File removed from album');
			} catch (error) {
				console.error(error);
			}
		},
		[selectedFile?.uuid]
	);

	const addTagToFile = useCallback(
		async (tagUuid: string) => {
			try {
				const { error } = await request.post({
					url: `file/${selectedFile?.uuid}/tag/${tagUuid}`
				});
				if (error) {
					toast.error(error);
					return;
				}

				toast.success('Tag added to file');
			} catch (error: any) {
				toast.error(error);
			}
		},
		[selectedFile?.uuid]
	);

	const createTag = useCallback(
		async (tag: string) => {
			if (tag.trim() === '') return;
			if (!tag) return;

			try {
				const { data: response, error } = await request.post({
					url: `tag/create`,
					body: { name: tag }
				});

				if (error) {
					toast.error(error);
					return;
				}

				if (response.tag) {
					setTags([
						...tags,
						{
							uuid: response.tag.uuid,
							name: response.tag.name
						}
					]);

					setFileTags([
						...fileTags,
						{
							uuid: response.tag.uuid,
							name: response.tag.name
						}
					]);

					void addTagToFile(response.tag.uuid);
				}
			} catch (error: any) {
				toast.error(error);
			}
		},
		[addTagToFile, fileTags, tags]
	);

	const removeTagFromFile = useCallback(
		async (tagUuid: string) => {
			try {
				const { error } = await request.delete({
					url: `file/${selectedFile?.uuid}/tag/${tagUuid}`
				});
				if (error) {
					toast.error(error);
					return;
				}

				toast.success('Tag removed from file');
			} catch (error) {
				console.error(error);
			}
		},
		[selectedFile?.uuid]
	);

	const onOpenChange = useCallback(
		(open: boolean) => {
			if (open) return;

			setModalOpen(open);
			setSelectedFile(null);
		},
		[setModalOpen, setSelectedFile]
	);

	const findPreviousFile = useCallback(() => {
		const previousIndex = (selectedFile?.index ?? 0) - 1;
		const newItem = allFiles?.at(previousIndex);
		if (selectedFile?.index !== 0 && newItem) {
			setSelectedFile(newItem);
			setLoading(true);
		}
	}, [selectedFile, allFiles, setSelectedFile, setLoading]);

	const findNextFile = useCallback(() => {
		const nextIndex = (selectedFile?.index ?? 0) + 1;
		const newItem = allFiles?.at(nextIndex);
		if (selectedFile?.index !== (allFiles?.length ?? 0) - 1 && newItem) {
			setSelectedFile(newItem);
			setLoading(true);
		}
	}, [selectedFile, allFiles, setSelectedFile, setLoading]);

	const onTouchStart = useCallback((e: any) => {
		setTouchEnd(null);
		setTouchStart(e.targetTouches?.[0]?.clientX ?? 0);
	}, []);

	const onTouchMove = useCallback((e: any) => setTouchEnd(e.targetTouches?.[0]?.clientX ?? 0), []);

	const onTouchEnd = useCallback(() => {
		if (!touchStart || !touchEnd) return;
		const distance = Number(touchStart) - Number(touchEnd);
		const isLeftSwipe = distance > swipeDistanceToTrigger;
		const isRightSwipe = distance < -swipeDistanceToTrigger;

		if (isLeftSwipe) {
			findNextFile();
		} else if (isRightSwipe) {
			findPreviousFile();
		}
	}, [touchStart, touchEnd, findNextFile, findPreviousFile]);

	const finishedLoading = useCallback(() => {
		setLoading(false);
		setZoomImageState({ currentZoom: 1 });
	}, [setZoomImageState]);

	useEventListener('keydown', event => {
		event.stopPropagation();

		if (tab === 'information') return;
		if (!selectedFile) {
			return;
		}

		if (event.key === 'ArrowLeft') {
			findPreviousFile();
		} else if (event.key === 'ArrowRight') {
			findNextFile();
		}
	});

	useEffect(() => {
		if (isModalOpen) {
			setTab('preview');

			if (imageZoomContainerRef.current) {
				createZoomImage(imageZoomContainerRef.current, { dblTapAnimationDuration: 150 });
			}
		}
	}, [isModalOpen, fetchExtraData, selectedFile, createZoomImage]);

	return selectedFile && currentType ? (
		<Dialog open={isModalOpen} onOpenChange={onOpenChange}>
			<DialogContent
				className={cn(
					'w-11/12 max-w-screen max-h-screen md:min-h-[calc(100vh-11rem)] lg:max-w-[calc(100vw-8rem)] lg:w-max p-0 min-w-60',
					tab === 'information' ? 'w-11/12 lg:w-5/6 xl:w-6/12' : ''
				)}
			>
				<div className="absolute right-0 -bottom-12 z-10 md:inline-block hidden">
					<FileInformationDialogActions file={selectedFile} type={currentType} />
				</div>

				<div className="absolute right-0 -bottom-12 z-10 md:hidden inline-block">
					<FileInformationDrawerActions file={selectedFile} type={currentType} />
				</div>

				<Tabs
					value={tab}
					onValueChange={value => {
						if (value === 'information') {
							void fetchExtraData();
						}

						setTab(value);
					}}
					className="relative"
				>
					{currentType === 'publicAlbum' ? null : (
						<div className="flex justify-center w-full absolute -top-12 pointer-events-none">
							<TabsList className="pointer-events-auto">
								<TabsTrigger value="preview">Preview</TabsTrigger>
								<TabsTrigger value="information">Information</TabsTrigger>
							</TabsList>
						</div>
					)}
					<TabsContent value="preview" className="mt-0">
						<div
							className={cn('h-[calc(100vh-11rem)]', 'w-full')}
							onTouchStart={onTouchStart}
							onTouchMove={onTouchMove}
							onTouchEnd={onTouchEnd}
						>
							<button
								type="button"
								aria-label="Previous"
								className="absolute top-[calc(50%-12px)] -left-12 hidden lg:inline-block"
								onClick={() => findPreviousFile()}
							>
								<ChevronLeft className="w-6 h-6" />
							</button>
							<button
								type="button"
								aria-label="Next"
								className="absolute top-[calc(50%-12px)] -right-12 hidden lg:inline-block"
								onClick={() => findNextFile()}
							>
								<ChevronRight className="w-6 h-6" />
							</button>
							{isFileImage(selectedFile) ? (
								<>
									<div
										className={cn(
											'h-full w-full absolute top-0 left-0 bg-black/50 select-none pointer-events-none',
											{
												hidden: !loading
											}
										)}
									>
										<Loader2Icon className="absolute top-1/2 left-1/2 w-8 h-8 -ml-4 -mt-4 animate-spin" />
									</div>
									<picture
										className="flex items-center justify-center h-full"
										ref={imageZoomContainerRef}
									>
										<img
											src={selectedFile.url}
											className="h-full object-contain md:block"
											draggable={false}
											fetchPriority="high"
											onLoad={() => finishedLoading()}
											onError={() => setLoading(false)}
										/>
									</picture>
								</>
							) : isFileVideo(selectedFile) ? (
								<MediaController className="h-full w-full">
									<video slot="media" src={selectedFile.url} crossOrigin="" className="h-full" />
									<MediaControlBar>
										<MediaPlayButton />
										<MediaMuteButton />
										<MediaVolumeRange />
										<MediaTimeRange />
										<MediaPipButton />
										<MediaFullscreenButton />
									</MediaControlBar>
								</MediaController>
							) : isFileAudio(selectedFile) ? (
								<MediaController className="w-full min-w-96 h-full">
									<audio slot="media" src={selectedFile.url} crossOrigin="" />
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
								<div className="h-full w-full">
									<FileTextViewer uuid={selectedFile.uuid} />
								</div>
							)}
						</div>
					</TabsContent>
					<TabsContent value="information" className="h-full">
						{isFileImage(selectedFile) ? (
							<picture>
								<img
									src={selectedFile.url}
									className="h-auto hidden absolute -top-px -left-[272px] xl:block border bg-background p-2 shadow-lg sm:rounded-lg max-w-[264px]"
								/>
							</picture>
						) : isFileVideo(selectedFile) ? (
							<video
								className="h-auto hidden absolute -top-px -left-[272px] xl:block border bg-background p-2 shadow-lg sm:rounded-lg max-w-[264px]"
								autoPlay
								loop
								muted
							>
								<source src={selectedFile.preview} type="video/mp4" />
							</video>
						) : null}
						<ScrollArea className="p-6 md:p-8 h-full">
							<div className="flex flex-col md:flex-row gap-8 max-h-[calc(100vh-16rem)]">
								<div className="flex flex-col gap-2 w-full">
									<h2 className="text-2xl font-semibold leading-none tracking-tight mb-4">
										File information
									</h2>

									<div>
										<Label htmlFor="uuid">UUID</Label>
										<Input value={selectedFile.uuid} name="uuid" id="uuid" readOnly />
									</div>

									<div>
										<Label htmlFor="name">Name</Label>
										<Input value={selectedFile.name} name="name" id="name" readOnly />
									</div>

									<div>
										<Label htmlFor="original">Original</Label>
										<Input value={selectedFile.original} name="original" id="original" readOnly />
									</div>

									<div>
										<Label htmlFor="ip">
											IP{' '}
											{currentType === 'admin' ? (
												<Link
													href={`/dashboard/admin/ip/${selectedFile.ip}`}
													className="text-blue-500 underline inline-flex items-center ml-2"
													onClick={() => setModalOpen(false)}
												>
													view files <ArrowUpRightFromSquare className="w-3 h-3 ml-1" />
												</Link>
											) : null}
										</Label>
										<Input value={selectedFile.ip} name="ip" id="ip" readOnly />
									</div>

									<div>
										<Label htmlFor="url">URL</Label>
										<Input value={selectedFile.url} name="url" id="url" readOnly />
									</div>

									<div>
										<Label htmlFor="size">Size</Label>
										<Input value={formatBytes(selectedFile.size)} name="size" id="size" readOnly />
									</div>

									<div>
										<Label htmlFor="hash">Hash</Label>
										<Input value={selectedFile.hash} name="hash" id="hash" readOnly />
									</div>

									<div>
										<Label htmlFor="uploaded">Uploaded</Label>
										<Input
											value={getDate(selectedFile.createdAt)}
											name="uploaded"
											id="uploaded"
											readOnly
										/>
									</div>
								</div>

								{currentType === 'admin' || currentType === 'quarantine' ? (
									<div className="w-full max-w-lg">
										<div className="flex flex-col gap-2">
											<h2 className="text-2xl font-semibold leading-none tracking-tight mb-4">
												User information
											</h2>

											{selectedFile.user ? (
												<>
													<div>
														<Label htmlFor="owner">
															Owner
															<Link
																href={`/dashboard/admin/users/${selectedFile.user?.uuid}`}
																className="text-blue-500 underline inline-flex items-center ml-2"
																onClick={() => setModalOpen(false)}
															>
																view files{' '}
																<ArrowUpRightFromSquare className="w-3 h-3 ml-1" />
															</Link>
														</Label>
														<Input
															value={selectedFile.user.username}
															name="owner"
															id="owner"
															readOnly
														/>
													</div>

													<div>
														<Label htmlFor="userUUID">User UUID</Label>
														<Input
															value={selectedFile.user?.uuid}
															name="userUUID"
															id="userUUID"
															readOnly
														/>
													</div>

													<div>
														<Label htmlFor="status">Status</Label>
														<Input
															value={selectedFile.user.enabled ? 'Enabled' : 'Disabled'}
															name="status"
															id="status"
															readOnly
														/>
													</div>

													<div>
														<Label htmlFor="null">Roles</Label>
														<div>
															{selectedFile.user.roles.map((role: any) => (
																<Badge key={role.name} className="mr-1">
																	{role.name}
																</Badge>
															))}
														</div>
													</div>

													<div>
														<Label htmlFor="joined">Joined</Label>
														<Input
															value={getDate(selectedFile.user.createdAt.toString())}
															name="joined"
															id="joined"
															readOnly
														/>
													</div>
												</>
											) : (
												<div>
													<Label htmlFor="owner">Owner</Label>
													<Input value="No owner" name="owner" id="owner" readOnly />
												</div>
											)}
										</div>
									</div>
								) : (
									<div className="w-full max-w-lg">
										<div className="flex flex-col gap-2">
											<h2 className="text-2xl font-semibold leading-none tracking-tight mb-4">
												Albums
											</h2>
											<div>
												<Label htmlFor="albums">Add albums</Label>
												<div className="font-light text-xs px-2 my-2 border-l-2 border-blue-500">
													A file can be added to multiple albums.
												</div>
												<FancyMultiSelect
													placeholder="Select album..."
													options={albums.map(album => ({
														value: album.uuid,
														label: album.name
													}))}
													initialSelected={fileAlbums.map(album => album.uuid)}
													onSelected={async value => addFileToAlbum(value)}
													onRemoved={async value => removeFileFromAlbum(value)}
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
													To create a new tag, type the name of the tag and press enter.{' '}
													<br />
													This will attach it to the file automatically.
												</div>

												<FancyMultiSelect
													placeholder="Select tags..."
													options={tags.map(tag => ({
														value: tag.uuid,
														label: tag.name
													}))}
													initialSelected={fileTags.map(tag => tag.uuid)}
													onSelected={async value => addTagToFile(value)}
													onRemoved={async value => removeTagFromFile(value)}
													onCreated={async value => createTag(value)}
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
	) : null;
}
