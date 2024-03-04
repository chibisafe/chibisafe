'use client';

import type { PropsWithChildren } from 'react';
import { useEffect, useRef } from 'react';
import { deleteFile } from '@/actions/FileInformationDialogActions';
import { MessageType } from '@/types';
import { useSetAtom } from 'jotai';
import { useFormState } from 'react-dom';
import { toast } from 'sonner';

import { isDialogOpenAtom } from '@/lib/atoms/fileInformationDialog';
import { ConfirmationDialog } from '@/components/dialogs/ConfirmationDialog';

export const ConfirmationAction = ({
	uuid,
	type,
	description,
	children
}: PropsWithChildren<{ readonly description: string; readonly type: string; readonly uuid: string }>) => {
	const setIsDialogOpen = useSetAtom(isDialogOpenAtom);
	const [state, formAction] = useFormState(deleteFile, {
		message: '',
		type: MessageType.Uninitialized
	});

	const formRef = useRef<HTMLFormElement>(null);

	useEffect(() => {
		if (state.type === MessageType.Error) toast.error(state.message);
		else if (state.type === MessageType.Success) {
			toast.success(state.message);
			setIsDialogOpen(false);
		}
	}, [state.message, state.type, setIsDialogOpen]);

	return (
		<form action={formAction} ref={formRef} className="w-full h-full">
			<input type="hidden" name="uuid" value={uuid} />
			<ConfirmationDialog description={description} callback={() => formRef.current?.requestSubmit()}>
				<button type="button" className="w-full h-full flex px-2 py-1.5 cursor-default">
					{children}
				</button>
			</ConfirmationDialog>
		</form>
	);
};
