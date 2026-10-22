'use client';

import { useAtomValue } from 'jotai';
import { forwardRef, useCallback } from 'react';
import type { FileTriggerProps } from 'react-aria-components';
import { FileTrigger } from '@/components/ui/file-trigger';
import { processDropItem } from '@/lib/dropzone';
import { settingsAtom } from '@/lib/atoms/settings';
import { useUploadFile } from '@/hooks/useUploadFile';

interface FileTriggerPropsWithAlbumUuid extends FileTriggerProps {
	readonly albumUuid?: string;
}

export const UploadTrigger = forwardRef<HTMLInputElement, FileTriggerPropsWithAlbumUuid>((props, ref) => {
	const { children, ...additionalProps } = props;
	const settings = useAtomValue(settingsAtom);

	const { queueFiles } = useUploadFile({ albumUuid: props.albumUuid ?? undefined });

	const onSelect = useCallback(
		async (files: FileList | null) => {
			if (files === null) {
				return;
			}

			for (const item of files) {
				const files = await processDropItem(item, settings);
				if (!files.length) continue;

				queueFiles(files);
			}
		},
		[settings, queueFiles]
	);

	return (
		<FileTrigger {...additionalProps} onSelect={onSelect} ref={ref} allowsMultiple>
			{children}
		</FileTrigger>
	);
});
