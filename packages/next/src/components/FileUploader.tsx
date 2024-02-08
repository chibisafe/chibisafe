'use client';

import { useCallback, useRef } from 'react';
import { chibiUploader, type UploaderOptions } from '@chibisafe/uploader-client';
import { useAtomValue, useSetAtom } from 'jotai';
import { UploadCloud } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { useEventListener } from 'usehooks-ts';

import { currentUserAtom } from '@/lib/atoms/currentUser';
import { settingsAtom } from '@/lib/atoms/settings';
import { uploadsAtom } from '@/lib/atoms/uploads';
import { formatBytes, getFileExtension } from '@/lib/file';
import { cn, debug } from '@/lib/utils';

export function FileUploader() {
	const settings = useAtomValue(settingsAtom);
	const currentUser = useAtomValue(currentUserAtom);
	const setUploads = useSetAtom(uploadsAtom);

	const fileInput = useRef<HTMLInputElement>(null);

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
					// @ts-ignore
					size: file.size
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
						}
					});
				},
				onProgress: (uuid: string, progress: any) => {
					debug(`Progress uploading ${file.name} with uuid ${uuid}`, progress);
					setUploads(draft => {
						const upload = draft.findIndex(u => u.uuid === uuid);
						if (upload !== -1) {
							draft[upload]!.bytesSent = progress.bytesSent;
							draft[upload]!.progress = progress.progress;
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
						}
					});
					return null;
				}
			});
		},
		[setUploads, settings?.chunkSize, settings?.maxSize]
	);

	const processFile = useCallback(
		async (file: File) => {
			if (settings?.blockedExtensions.length) {
				const extension = getFileExtension(file);
				if (!extension) return;
				if (settings?.blockedExtensions.includes(`.${extension}`)) {
					toast.error(`File extension .${extension} is blocked`);
					return;
				}
			}

			if (!settings?.useNetworkStorage) {
				await uploadFile({ file, endpoint: '/api/upload', isNetworkStored: false, method: 'POST' });
				return;
			}

			// TODO: Since we're using credentials: include this will fail if the
			// instance is set to public and the user is not logged in. probably.
			const getSignedUrl = await fetch('/api/upload', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					credentials: 'include'
				},
				body: JSON.stringify({
					contentType: file.type,
					name: file.name,
					size: file.size
				})
			});

			if (!getSignedUrl.ok) {
				const error = await getSignedUrl.json();
				toast.error(error.message);
				return;
			}

			const { url, identifier, publicUrl } = await getSignedUrl.json();

			await uploadFile({ file, endpoint: url, isNetworkStored: true, method: 'PUT', identifier, publicUrl });
		},
		[settings?.blockedExtensions, settings?.useNetworkStorage, uploadFile]
	);

	const onPaste = (event: ClipboardEvent) => {
		if (!event.clipboardData) return;

		if (event.clipboardData.files?.length) {
			for (const file of Array.from(event.clipboardData.files)) {
				if (!file?.type) continue;

				const fileData = new File([file], `pasted-file.${getFileExtension(file)}`, {
					type: file.type
				});

				onFileAdded([fileData]);
			}
		}
	};

	useEventListener('paste', onPaste);

	const onFileAdded = useCallback(
		(acceptedFiles: File[]) => {
			if (!acceptedFiles.length) return;

			for (const file of acceptedFiles) {
				void processFile(file);
			}
		},
		[processFile]
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: onFileAdded });
	return settings ? (
		<div className="w-80 h-fit max-h-[320px] flex-col right-0 top-0 space-y-2" {...getRootProps()}>
			<div
				className={cn([
					'w-80 h-80 right-0 top-0 bg-[#181a1b] rounded-3xl border-4 shadow-lg flex items-center justify-center blueprint flex-col cursor-pointer hover:border-[#3b3e40] transform-gpu transition-all',
					isDragActive ? 'border-blue-400' : 'border-[#303436]'
				])}
			>
				{settings.publicMode || currentUser?.uuid ? (
					<>
						<UploadCloud className="h-12 w-12 pointer-events-none " />
						<h3 className="font-bold text-center mt-4 pointer-events-none">
							<p className="">
								{' '}
								DROP FILES OR <br />
								<span className="text-blue-400">CLICK HERE</span>{' '}
							</p>
						</h3>
						<p className="text-center mt-4 w-3/4 pointer-events-none inline-block">
							{formatBytes(settings.maxSize)} max per file
						</p>

						<input ref={fileInput} type="file" className="hidden" multiple {...getInputProps()} />
					</>
				) : (
					<h3 className="text-center mt-4  w-3/4 pointer-events-none">
						Anonymous upload is disabled. <br />
						Please log in.
					</h3>
				)}
			</div>
		</div>
	) : (
		<div>Loading...</div>
	);
}
