'use client';

import { type FilePropsType } from '@/types';
import { deleteFiles } from '@/actions/BulkActions';
import { useSetAtom } from 'jotai';
import { confirmationDialogAtom } from '@/lib/atoms/dialogs/confirmationDialog';
import { useServerAction } from '@/hooks/useServerAction';

export const BulkDeleteFilesAction = ({ uuids, type }: { readonly type: FilePropsType; readonly uuids: string[] }) => {
	const setConfirmationDialog = useSetAtom(confirmationDialogAtom);
	const { formAction, isPending } = useServerAction({
		action: deleteFiles,
		identifier: uuids,
		secondaryIdentifier: type
	});

	return (
		<button
			type="submit"
			className="w-full h-full flex px-2 py-1.5 cursor-default"
			disabled={isPending}
			onClick={() => {
				setConfirmationDialog({
					callback: () => formAction(),
					description: `This action will delete the selected ${uuids.length} file${uuids.length > 1 ? 's' : ''}.`
				});
			}}
		>
			Delete {uuids.length} {uuids.length > 1 ? 'files' : 'file'}
		</button>
	);
};
