'use client';

import type { PropsWithChildren } from 'react';
import { useEffect, useRef } from 'react';
import { MessageType } from '@/types';
import { useFormState } from 'react-dom';
import { toast } from 'sonner';

import { ConfirmationDialog } from '@/components/dialogs/ConfirmationDialog';
import { deleteLink } from '@/actions/AlbumSettingsDialogActions';
import { useQueryClient } from '@tanstack/react-query';

export const AlbumLinksConfirmationAction = ({
	uuid,
	albumUuid,
	description,
	children
}: PropsWithChildren<{ readonly albumUuid: string; readonly description: string; readonly uuid: string }>) => {
	const [state, formAction] = useFormState(deleteLink, {
		message: '',
		type: MessageType.Uninitialized
	});
	const queryClient = useQueryClient();

	const formRef = useRef<HTMLFormElement>(null);

	useEffect(() => {
		if (state.type === MessageType.Error) toast.error(state.message);
		else if (state.type === MessageType.Success) {
			toast.success(state.message);
			void queryClient.invalidateQueries({ queryKey: ['albums', 'links'] });
		}

		return () => {
			if (state.type === MessageType.Success) {
				state.type = MessageType.Uninitialized;
				state.message = '';
			}
		};
	}, [state.message, state.type, state, queryClient]);

	return (
		<form action={formAction} ref={formRef} className="h-full">
			<input type="hidden" name="uuid" value={uuid} />
			<input type="hidden" name="albumUuid" value={albumUuid} />
			<ConfirmationDialog description={description} callback={() => formRef.current?.requestSubmit()}>
				{children}
			</ConfirmationDialog>
		</form>
	);
};
