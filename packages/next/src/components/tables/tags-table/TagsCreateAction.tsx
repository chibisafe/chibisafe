'use client';

import type { PropsWithChildren } from 'react';
import { useEffect, useRef } from 'react';
import { MessageType } from '@/types';
import { useFormState } from 'react-dom';
import { toast } from 'sonner';

import { ConfirmationDialog } from '@/components/dialogs/ConfirmationDialog';
import { createTag } from '@/actions/TagsActions';

export const TagsConfirmationAction = ({
	uuid,
	description,
	children
}: PropsWithChildren<{ readonly description: string; readonly uuid: string }>) => {
	const [state, formAction] = useFormState(createTag, {
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
		<form action={formAction} ref={formRef} className="h-full">
			<input type="hidden" name="uuid" value={uuid} />
			<ConfirmationDialog description={description} callback={() => formRef.current?.requestSubmit()}>
				{children}
			</ConfirmationDialog>
		</form>
	);
};
