'use client';

import { useAtomValue, useSetAtom } from 'jotai';
import { forwardRef, useCallback } from 'react';
import type { FileTriggerProps } from 'react-aria-components';
import { FileTrigger } from '@/components/ui/file-trigger';
import { processDropItem } from '@/lib/dropzone';
import { settingsAtom } from '@/lib/atoms/settings';
import { uploadsAtom } from '@/lib/atoms/uploads';
import type { UploaderOptions } from '@chibisafe/uploader-client';
import { chibiUploader } from '@chibisafe/uploader-client';
import { toast } from 'sonner';
import { debug } from '@/lib/utils';

interface FileTriggerPropsWithAlbumUuid extends FileTriggerProps {
	readonly albumUuid?: string;
}

export const UploadTrigger = forwardRef<HTMLInputElement, FileTriggerPropsWithAlbumUuid>((props, ref) => {
	const { children, ...additionalProps } = props;
	const settings = useAtomValue(settingsAtom);
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
					credentials: 'include',
					albumuuid: props.albumUuid ?? ''
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
							url: '',
							albumUuid: props.albumUuid ?? null
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
								credentials: 'include',
								albumuuid: props.albumUuid ?? ''
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
		[props.albumUuid, setUploads, settings?.chunkSize, settings?.maxSize]
	);

	const onSelect = useCallback(
		async (files: FileList | null) => {
			if (files === null) {
				return;
			}

			for (const item of files) {
				const files = await processDropItem(item, settings);
				if (!files.length) return;

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

					return;
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

	return (
		<FileTrigger {...additionalProps} onSelect={onSelect} ref={ref}>
			{children}
		</FileTrigger>
	);
});
