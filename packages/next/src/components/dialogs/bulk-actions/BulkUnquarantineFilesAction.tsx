'use client';

import { unquarantineFiles } from '@/actions/BulkActions';
import { useSetAtom } from 'jotai';
import { confirmationDialogAtom } from '@/lib/atoms/dialogs/confirmationDialog';
import { useServerAction } from '@/hooks/useServerAction';

export const BulkUnquarantineFilesAction = ({ uuids }: { readonly uuids: string[] }) => {
	const setConfirmationDialog = useSetAtom(confirmationDialogAtom);
	const { formAction, isPending } = useServerAction({
		action: unquarantineFiles,
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
					description: `This action will remove the selected ${uuids.length} file${uuids.length > 1 ? 's' : ''} from quarantine and enable access to them again.`
				});
			}}
		>
			Unquarantine {uuids.length} {uuids.length > 1 ? 'files' : 'file'}
		</button>
	);
};
