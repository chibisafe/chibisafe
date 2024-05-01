'use client';

import { useActionState, useEffect } from 'react';
import { MessageType, type FilePropsType } from '@/types';
import { toast } from 'sonner';

import { ConfirmationDialog } from '../ConfirmationDialog';
import { Button } from '@/components/ui/button';
import { deleteFiles } from '@/actions/BulkActions';

export const BulkDeleteFilesAction = ({
	uuids,
	type,
	isDrawer = false
}: {
	readonly isDrawer?: boolean | undefined;
	readonly type: FilePropsType;
	readonly uuids: string[];
}) => {
	const [state, formAction, isPending] = useActionState(deleteFiles.bind(null, uuids, type), {
		message: '',
		type: MessageType.Uninitialized
	});

	useEffect(() => {
		if (state.type === MessageType.Error) toast.error(state.message);
		else if (state.type === MessageType.Success) {
			toast.success(state.message);
		}

		return () => {
			if (state.type === MessageType.Success) {
				state.type = MessageType.Uninitialized;
				state.message = '';
			}
		};
	}, [state.message, state.type, state, uuids.length]);

	return (
		<ConfirmationDialog
			description={`This action will delete the selected ${uuids.length} file${uuids.length > 1 ? 's' : ''}.`}
			callback={() => formAction()}
		>
			{isDrawer ? (
				<Button type="submit" variant="destructive" className="w-full" disabled={isPending}>
					Delete {uuids.length}
					{uuids.length > 1 ? 'files' : 'file'}
				</Button>
			) : (
				<button type="submit" className="w-full h-full flex px-2 py-1.5 cursor-default" disabled={isPending}>
					Delete {uuids.length} {uuids.length > 1 ? 'files' : 'file'}
				</button>
			)}
		</ConfirmationDialog>
	);
};
