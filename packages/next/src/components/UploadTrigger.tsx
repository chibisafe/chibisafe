'use client';

import { useAtomValue } from 'jotai';
import { forwardRef, useCallback } from 'react';
import type { FileTriggerProps } from 'react-aria-components';
import { FileTrigger } from '@/components/ui/file-trigger';
import { getSignedUrl, processDropItem } from '@/lib/dropzone';
import { settingsAtom } from '@/lib/atoms/settings';
import { toast } from 'sonner';
import { useUploadFile } from '@/hooks/useUploadFile';

interface FileTriggerPropsWithAlbumUuid extends FileTriggerProps {
	readonly albumUuid?: string;
}

export const UploadTrigger = forwardRef<HTMLInputElement, FileTriggerPropsWithAlbumUuid>((props, ref) => {
	const { children, ...additionalProps } = props;
	const settings = useAtomValue(settingsAtom);

	const { uploadFile } = useUploadFile({ albumUuid: props.albumUuid });

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

						const { url, identifier, publicUrl, error } = await getSignedUrl(actualFile);
						if (error) {
							toast.error(error);
							return;
						}

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
