import { useCallback, useEffect, useState, type PropsWithChildren } from 'react';

import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import type { Album, FilePropsType, FileWithAdditionalData, Tag } from '@/types';
import { ScrollArea } from './ui/scroll-area';
import { Label } from './ui/label';
import { Input } from './ui/input';
import Link from 'next/link';
import { ArrowUpRightFromSquare, InfoIcon } from 'lucide-react';
import { formatBytes } from '@/lib/file';
import { getDate } from '@/lib/time';
import { Badge } from './ui/badge';
import { FancyMultiSelect } from './FancyMultiSelect';
import { useMediaQuery } from 'usehooks-ts';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip } from './Tooltip';
import { Button } from './ui/button';
import request from '@/lib/request';
import { toast } from 'sonner';
import { useSetAtom } from 'jotai';
import { isDialogOpenAtom } from '@/lib/atoms/fileDialog';

const OpenButton = () => {
	return (
		<Tooltip content="Information">
			<Button size={'icon'} variant={'ghost'}>
				<InfoIcon className="h-5 w-5" />
			</Button>
		</Tooltip>
	);
};

const ComponentToRender = ({ children }: PropsWithChildren<{}>) => {
	const isMobile = useMediaQuery('(max-width: 768px)');
	return isMobile ? (
		<Drawer>
			<DrawerTrigger>
				<OpenButton />
			</DrawerTrigger>
			<DrawerContent>
				<ScrollArea className="h-svh pb-24">{children}</ScrollArea>
			</DrawerContent>
		</Drawer>
	) : (
		<Sheet>
			<SheetTrigger>
				<OpenButton />
			</SheetTrigger>
			<SheetContent>
				<ScrollArea className="p-6 md:p-8 h-full">{children}</ScrollArea>
			</SheetContent>
		</Sheet>
	);
};

export const FileDialogInformation = ({
	file,
	type
}: PropsWithChildren<{ readonly file: FileWithAdditionalData; readonly type: FilePropsType }>) => {
	const [tags, setTags] = useState<Tag[]>([]);
	const [fileTags, setFileTags] = useState<Tag[]>([]);
	const [albums, setAlbums] = useState<Album[]>([]);
	const [fileAlbums, setFileAlbums] = useState<Album[]>([]);
	const setModalOpen = useSetAtom(isDialogOpenAtom);

	const addFileToAlbum = useCallback(
		async (albumUuid: string) => {
			try {
				const { error } = await request.post({
					url: `file/${file?.uuid}/album/${albumUuid}`
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
		[file?.uuid]
	);

	const removeFileFromAlbum = useCallback(
		async (albumUuid: string) => {
			try {
				const { error } = await request.delete({
					url: `file/${file?.uuid}/album/${albumUuid}`
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
		[file?.uuid]
	);

	const addTagToFile = useCallback(
		async (tagUuid: string) => {
			try {
				const { error } = await request.post({
					url: `file/${file?.uuid}/tag/${tagUuid}`
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
		[file?.uuid]
	);

	const removeTagFromFile = useCallback(
		async (tagUuid: string) => {
			try {
				const { error } = await request.delete({
					url: `file/${file?.uuid}/tag/${tagUuid}`
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
		[file?.uuid]
	);

	const fetchAdditionalData = useCallback(async () => {
		try {
			if (type === 'admin') return;
			if (type === 'publicAlbum') return;
			if (type === 'quarantine') return;

			const { data: userAlbums, error: userAlbumsError } = await request.get({
				url: 'albums',
				query: { limit: 9999 },
				options: {
					next: {
						tags: ['albums']
					}
				}
			});
			if (userAlbumsError) {
				toast.error(userAlbumsError);
				return;
			}

			setAlbums(userAlbums.albums);

			const { data: userTags, error: userTagsError } = await request.get({
				url: 'tags',
				query: { limit: 9999 },
				options: {
					next: {
						tags: ['albums']
					}
				}
			});
			setTags(userTags.tags);
			if (userTagsError) {
				toast.error(userTagsError);
				return;
			}

			const { data: userFile, error: userFileError } = await request.get({ url: `file/${file?.uuid}` });
			if (userFileError) {
				toast.error(userFileError);
				return;
			}

			setFileAlbums(userFile.file.albums);
			setFileTags(userFile.file.tags);
		} catch (error) {
			console.error(error);
		}
	}, [file?.uuid, type]);

	useEffect(() => {
		void fetchAdditionalData();
	}, [fetchAdditionalData]);

	return (
		<ComponentToRender>
			<div className="flex flex-col gap-8 p-6 md:p-0">
				<input type="text" className="opacity-0 pointer-events-none select-none" />
				{type === 'admin' || type === 'quarantine' ? (
					<div className="w-full max-w-lg">
						<div className="flex flex-col gap-2">
							<h2 className="text-2xl font-semibold leading-none tracking-tight mb-4">
								User information
							</h2>

							{file.user ? (
								<>
									<div>
										<Label htmlFor="owner">
											Owner
											<Link
												href={`/dashboard/admin/users/${file.user?.uuid}`}
												className="text-blue-500 underline inline-flex items-center ml-2"
												onClick={() => setModalOpen(false)}
											>
												view files <ArrowUpRightFromSquare className="w-3 h-3 ml-1" />
											</Link>
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
											value={getDate(file.user.createdAt.toString())}
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
					<div className="w-full">
						<div className="flex flex-col gap-2">
							<h2 className="text-2xl font-semibold leading-none tracking-tight mb-4">Albums</h2>
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
							<h2 className="text-2xl font-semibold leading-none tracking-tight mb-4">Tags</h2>
							<div>
								<Label htmlFor="tags">Attach tags</Label>
								<div className="font-light text-xs px-2 my-2 border-l-2 border-blue-500">
									To create a new tag, type the name of the tag and press enter. <br />
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
								/>
							</div>
						</div>
					</div>
				)}

				<div className="flex flex-col gap-2 w-full">
					<h2 className="text-2xl font-semibold leading-none tracking-tight mb-4">File information</h2>

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
								<Link
									href={`/dashboard/admin/ip/${file.ip}`}
									className="text-blue-500 underline inline-flex items-center ml-2"
									onClick={() => setModalOpen(false)}
								>
									view files <ArrowUpRightFromSquare className="w-3 h-3 ml-1" />
								</Link>
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
						<Input value={getDate(file.createdAt)} name="uploaded" id="uploaded" readOnly />
					</div>
				</div>
			</div>
		</ComponentToRender>
	);
};
