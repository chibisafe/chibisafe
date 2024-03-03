'use client';

import { useEffect } from 'react';
import { quarantineFile } from '@/actions/FileInformationDialogActions';
import { MessageType } from '@/types';
import { useSetAtom } from 'jotai';
import { useFormState } from 'react-dom';
import { toast } from 'sonner';

import { isDialogOpenAtom } from '@/lib/atoms/fileInformationDialog';

export const QuarantineFileInformationAction = ({ uuid }: { readonly uuid: string }) => {
	const setIsDialogOpen = useSetAtom(isDialogOpenAtom);
	const [state, formAction] = useFormState(quarantineFile, {
		message: '',
		type: MessageType.Uninitialized
	});

	useEffect(() => {
		if (state.type === MessageType.Error) toast.error(state.message);
		else if (state.type === MessageType.Success) {
			toast.success(state.message);
			setIsDialogOpen(false);
		}
	}, [state.message, state.type, setIsDialogOpen]);

	return (
		<form action={formAction} className="w-full h-full">
			<input type="hidden" name="uuid" value={uuid} />
			<button type="submit" className="w-full h-full flex px-2 py-1.5">
				Quarantine
			</button>
		</form>
	);
};
