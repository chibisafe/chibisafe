'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';

import { ConfirmationDialog } from '../ConfirmationDialog';
import { Button } from '@/components/ui/button';
import request from '@/lib/request';

export const BulkRegenerateThumbnailsAction = ({
	uuids,
	isDrawer = false
}: {
	readonly isDrawer?: boolean | undefined;
	readonly uuids: string[];
}) => {
	const regenerateThumbs = useCallback(async () => {
		try {
			const { error } = await request.post({
				url: 'files/thumbnail/regenerate',
				body: { files: uuids }
			});

			if (error) {
				toast.error(error);
				return;
			}

			toast.success(
				`${uuids.length} ${uuids.length > 1 ? 'files' : 'file'} thumbnail${uuids.length > 1 ? 's' : ''} regenerated`
			);
		} catch (error) {
			console.error(error);
		}
	}, [uuids]);

	return (
		<ConfirmationDialog
			description={`This action will regenerate thumbnails for ${uuids.length} file${uuids.length > 1 ? 's' : ''}.`}
			callback={async () => regenerateThumbs()}
		>
			{isDrawer ? (
				<Button className="w-full">Regenerate thumbnails</Button>
			) : (
				<button type="button" className="w-full h-full flex px-2 py-1.5 cursor-default">
					Regenerate thumbnails
				</button>
			)}
		</ConfirmationDialog>
	);
};
