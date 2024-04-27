'use client';

import { useCallback } from 'react';
import type { FilePropsType } from '@/types';
import { toast } from 'sonner';

import { ConfirmationDialog } from '../ConfirmationDialog';
import { Button } from '@/components/ui/button';
import request from '@/lib/request';

export const BulkDeleteFilesAction = ({
	uuids,
	type,
	isDrawer = false
}: {
	readonly isDrawer?: boolean | undefined;
	readonly type: FilePropsType;
	readonly uuids: string[];
}) => {
	const deleteFiles = useCallback(async () => {
		const url =
			type === 'admin' ? 'admin/files/delete' : type === 'quarantine' ? 'admin/files/delete' : 'files/delete';
		try {
			const { error } = await request.post({
				url,
				body: { files: uuids }
			});

			if (error) {
				toast.error(error);
				return;
			}

			// TODO: Refetch files. Maybe build something that we can submit a form to
			// to the SSR server to refetch the files when doing client API calls?
			toast.success(`${uuids.length} ${uuids.length > 1 ? 'files' : 'file'} removed`);
		} catch (error) {
			console.error(error);
		}
	}, [type, uuids]);

	return (
		<ConfirmationDialog
			description={`This action will delete the selected ${uuids.length} file${uuids.length > 1 ? 's' : ''}.`}
			callback={async () => deleteFiles()}
		>
			{isDrawer ? (
				<Button variant="destructive" className="w-full">
					Delete {uuids.length}
					{uuids.length > 1 ? 'files' : 'file'}
				</Button>
			) : (
				<button type="button" className="w-full h-full flex px-2 py-1.5 cursor-default">
					Delete {uuids.length} {uuids.length > 1 ? 'files' : 'file'}
				</button>
			)}
		</ConfirmationDialog>
	);
};
