'use client';

import type { DropEvent } from '@react-types/shared';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { PackageOpen } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';
import type { FileDropItem, DropItem, DropZoneProps } from 'react-aria-components';
import { globalDropZoneOpenAtom } from '@/lib/atoms/dropzone';
import { DropZone } from '@/components/ui/dropzone';
import { cn, debug } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { settingsAtom } from '@/lib/atoms/settings';
import { currentUserAtom } from '@/lib/atoms/currentUser';
import { toast } from 'sonner';
import type { UploaderOptions } from '@chibisafe/uploader-client';
import { chibiUploader } from '@chibisafe/uploader-client';
import { uploadsAtom } from '@/lib/atoms/uploads';
import { processDropItem } from '@/lib/dropzone';

export const GlobalDropZone = (props: DropZoneProps) => {
	const { className, children, ...additionalProps } = props;

	const ref = useRef<HTMLDivElement>(null);
	const [globalDropZoneOpen, setGlobalDropZoneOpen] = useAtom(globalDropZoneOpenAtom);
	// const setDroppedFiles = useSetAtom(droppedFilesAtom);
	// const setMaxFilesModalOpen = useSetAtom(maxFilesModalOpenAtom);
	// const setPendingFiles = useSetPendingFiles();

	const settings = useAtomValue(settingsAtom);
	const currentUser = useAtomValue(currentUserAtom);
	const setUploads = useSetAtom(uploadsAtom);

	const uploadFile = useCallback(
		async ({
			file,
			endpoint,
			isNetworkStored,
			method = 'POST',
			identifier = '',
			publicUrl = ''
		}: {
			endpoint: string;
			file: File;
			identifier?: string;
			isNetworkStored: boolean;
			method: 'POST' | 'PUT';
			publicUrl?: string;
		}) => {
			const options: UploaderOptions = {
				debug: process.env.NODE_ENV !== 'production',
				endpoint,
				file,
				method,
				maxFileSize: settings?.maxSize ?? 0,
				// If we're storing in s3, we don't want to chunk the file
				chunkSize: isNetworkStored ? settings?.maxSize ?? 0 : settings?.chunkSize ?? 0,
				autoStart: true,
				maxParallelUploads: 1
			};

			if (isNetworkStored) {
				options.headers = {
					'Content-Type': file.type
				};
			} else {
				options.postParams = {
					name: file.name,
					type: file.type,
					size: file.size.toString()
				};

				options.headers = {
					credentials: 'include'
					// authorization: token.value ? `Bearer ${token.value}` : '',
					// albumuuid: isLoggedIn.value
					// 	? albumsStore.selectedAlbumForUpload
					// 		? albumsStore.selectedAlbumForUpload
					// 		: ''
					// 	: ''
				};
			}

			await chibiUploader({
				...options,
				onStart: (uuid: string, totalChunks: number) => {
					debug(`Started uploading ${file.name} with uuid ${uuid} and ${totalChunks} chunks`);
					setUploads(draft => {
						draft.push({
							uuid,
							name: file.name,
							type: file.type,
							processing: true,
							status: 'uploading',
							bytesSent: 0,
							bytesTotal: file.size,
							progress: 0,
							url: ''
						});
					});
				},
				onError: (uuid: string, error: any) => {
					debug(`Error uploading ${file.name} with uuid ${uuid}`, error.message);
					setUploads(draft => {
						const upload = draft.findIndex(file => file.uuid === uuid);
						if (upload !== -1) {
							draft[upload]!.status = 'error';
							draft[upload]!.error = error.message;
							draft[upload]!.processing = false;
						}
					});
				},
				onProgress: (uuid: string, progress: any) => {
					debug(`Progress uploading ${file.name} with uuid ${uuid}`, progress);
					setUploads(draft => {
						const upload = draft.findIndex(u => u.uuid === uuid);
						if (upload !== -1) {
							draft[upload]!.progress = progress;
						}
					});
				},
				onRetry: (_, reason: any) => {
					console.log('onRetry', reason);
				},
				onFinish: async (uuid: string, response: any) => {
					if (isNetworkStored) {
						debug('Finished uploading file to S3 storage', {
							name: file.name,
							uuid,
							url: publicUrl
						});

						setUploads(draft => {
							const upload = draft.findIndex(file => file.uuid === uuid);
							if (upload !== -1) {
								draft[upload]!.status = 'success';
								draft[upload]!.url = publicUrl;
								draft[upload]!.processing = false;
							}
						});

						return fetch('/api/upload/process', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
								credentials: 'include'
								// authorization: token.value ? `Bearer ${token.value}` : '',
								// albumuuid: isLoggedIn.value
								// 	? albumsStore.selectedAlbumForUpload
								// 		? albumsStore.selectedAlbumForUpload
								// 		: ''
								// 	: ''
							},
							body: JSON.stringify({ identifier, name: file.name, type: file.type })
						})
							.then(async res => {
								if (!res.ok) {
									const error = await res.json();
									throw new Error(error.message);
								}

								return res.json();
							})
							.then(res => {
								setUploads(draft => {
									const upload = draft.findIndex(file => file.uuid === uuid);
									if (upload !== -1) {
										draft[upload]!.status = 'success';
										draft[upload]!.url = res.url;
										draft[upload]!.processing = false;
									}
								});

								debug('Finished processing file', {
									name: file.name,
									uuid,
									url: res.url
								});
							})
							.catch(error => {
								setUploads(draft => {
									const upload = draft.findIndex(file => file.uuid === uuid);
									if (upload !== -1) {
										draft[upload]!.status = 'error';
										draft[upload]!.error = error.message;
										draft[upload]!.processing = false;
									}
								});
								toast.error(error.message);
							});
					}

					debug('Finished uploading file', {
						name: file.name,
						uuid,
						url: response.url
					});

					setUploads(draft => {
						const upload = draft.findIndex(file => file.uuid === uuid);
						if (upload !== -1) {
							draft[upload]!.status = 'success';
							draft[upload]!.url = response.url;
							draft[upload]!.processing = false;
						}
					});
					return null;
				}
			});
		},
		[setUploads, settings?.chunkSize, settings?.maxSize]
	);

	const onDrop = useCallback(
		async (ev: DropEvent) => {
			for (const item of ev.items) {
				const files = await processDropItem(item, settings);
				if (!files.length) continue;

				if (!settings?.useNetworkStorage) {
					void Promise.all(
						files.map(async file =>
							uploadFile({
								file: file instanceof File ? file : await file.getFile(),
								endpoint: '/api/upload',
								isNetworkStored: false,
								method: 'POST'
							})
						)
					);

					continue;
				}

				void Promise.all(
					files.map(async file => {
						const actualFile = file instanceof File ? file : await file.getFile();

						// TODO: Since we're using credentials: include this will fail if the
						// instance is set to public and the user is not logged in. probably.
						const getSignedUrl = await fetch('/api/upload', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
								credentials: 'include'
							},
							body: JSON.stringify({
								contentType: actualFile.type,
								name: actualFile.name,
								size: actualFile.size
							})
						});

						if (!getSignedUrl.ok) {
							const error = await getSignedUrl.json();
							toast.error(error.message);
							return;
						}

						const { url, identifier, publicUrl } = await getSignedUrl.json();

						await uploadFile({
							file: actualFile,
							endpoint: url,
							isNetworkStored: true,
							method: 'PUT',
							identifier,
							publicUrl
						});
					})
				);
			}
		},
		[settings, uploadFile]
	);

	useEffect(() => {
		const dragEnterHandler = (ev: DragEvent) => {
			if (ev.dataTransfer?.types.includes('Files')) {
				setGlobalDropZoneOpen(true);
			}
		};

		window.addEventListener('dragenter', dragEnterHandler);

		return () => {
			window.removeEventListener('dragenter', dragEnterHandler);
		};
	}, [setGlobalDropZoneOpen]);

	return (
		<DropZone
			{...additionalProps}
			className={cn(
				'fixed inset-0 z-50 p-4 transition-all',
				globalDropZoneOpen
					? 'duration-250 visible opacity-100 fade-in'
					: 'duration-250 invisible opacity-0 fade-out',
				className
			)}
			onDrop={onDrop}
			onDropExit={() => setGlobalDropZoneOpen(false)}
			ref={ref}
		>
			<AnimatePresence>
				{globalDropZoneOpen ? (
					<div className="global-dropzone-border h-full w-full rounded-xl p-px">
						<div className="relative h-full w-full rounded-xl bg-tum-lavender-100/[0.64] dark:bg-tum-lavender-800/[0.64]">
							<motion.div
								animate={{ opacity: 1, y: 0 }}
								className="absolute bottom-6 left-1/2"
								exit={{ y: 50, opacity: 0 }}
								initial={{ y: 50, x: '-50%', opacity: 0 }}
								key="bottom-banner-outer"
								transition={{ duration: 0.25 }}
							>
								<motion.div
									animate={{ y: [0, -10] }}
									className=" flex items-center gap-2 rounded-lg bg-tum-lavender-600 px-6 py-5 text-tum-base text-tum-neutral-40 dark:bg-tum-lavender-400 dark:text-tum-neutral-900"
									key="bottom-banner-inner"
									transition={{
										delay: 0.25,
										duration: 0.75,
										repeat: Number.POSITIVE_INFINITY,
										repeatType: 'reverse'
									}}
								>
									Drop files to upload them to <PackageOpen size={18} strokeWidth={1.5} />{' '}
									<span className="text-tum-label-base">My draft files</span>
								</motion.div>
							</motion.div>
						</div>
					</div>
				) : null}
			</AnimatePresence>
		</DropZone>
	);
};
