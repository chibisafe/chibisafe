'use client';

import { regenerateThumbnails } from '@/actions/BulkActions';
import { useSetAtom } from 'jotai';
import { confirmationDialogAtom } from '@/lib/atoms/dialogs/confirmationDialog';
import { useServerAction } from '@/hooks/useServerAction';

export const BulkRegenerateThumbnailsAction = ({ uuids }: { readonly uuids: string[] }) => {
	const setConfirmationDialog = useSetAtom(confirmationDialogAtom);
	const { formAction, isPending } = useServerAction({
		action: regenerateThumbnails,
		identifier: uuids
	});

	return (
		<button
			type="submit"
			className="w-full h-full flex px-2 py-1.5 cursor-default"
			disabled={isPending}
			onClick={() => {
				setConfirmationDialog({
					callback: () => formAction(),
					description: `This action will regenerate thumbnails for ${uuids.length} file${uuids.length > 1 ? 's' : ''}.`
				});
			}}
		>
			Regenerate thumbnails
		</button>
	);
};
