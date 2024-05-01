'use client';

import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';

import { ConfirmationDialog } from '../ConfirmationDialog';
import { Button } from '@/components/ui/button';
import { regenerateThumbnails } from '@/actions/BulkActions';
import { MessageType } from '@/types';

export const BulkRegenerateThumbnailsAction = ({
	uuids,
	isDrawer = false
}: {
	readonly isDrawer?: boolean | undefined;
	readonly uuids: string[];
}) => {
	const [state, formAction, isPending] = useActionState(regenerateThumbnails.bind(null, uuids), {
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
			description={`This action will regenerate thumbnails for ${uuids.length} file${uuids.length > 1 ? 's' : ''}.`}
			callback={() => formAction()}
		>
			{isDrawer ? (
				<Button type="submit" className="w-full" disabled={isPending}>
					Regenerate thumbnails
				</Button>
			) : (
				<button type="submit" className="w-full h-full flex px-2 py-1.5 cursor-default" disabled={isPending}>
					Regenerate thumbnails
				</button>
			)}
		</ConfirmationDialog>
	);
};
