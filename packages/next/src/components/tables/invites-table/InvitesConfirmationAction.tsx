'use client';

import type { PropsWithChildren } from 'react';
import { useEffect, useRef } from 'react';
import { MessageType } from '@/types';
import { useFormState } from 'react-dom';
import { toast } from 'sonner';

import { ConfirmationDialog } from '@/components/dialogs/ConfirmationDialog';
import { revokeInvite } from '@/actions/InviteActions';

export const InvitesConfirmationAction = ({
	code,
	description,
	children
}: PropsWithChildren<{ readonly code: string; readonly description: string }>) => {
	const [state, formAction] = useFormState(revokeInvite, {
		message: '',
		type: MessageType.Uninitialized
	});

	const formRef = useRef<HTMLFormElement>(null);

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
	}, [state.message, state.type, state]);

	return (
		<form action={formAction} ref={formRef} className="w-full h-full">
			<input type="hidden" name="code" value={code} />
			<ConfirmationDialog description={description} callback={() => formRef.current?.requestSubmit()}>
				{children}
			</ConfirmationDialog>
		</form>
	);
};
