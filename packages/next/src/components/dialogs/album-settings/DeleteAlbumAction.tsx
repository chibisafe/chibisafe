'use client';

import { useEffect } from 'react';
import { deleteAlbum } from '@/actions/AlbumSettingsDialogActions';
import { MessageType } from '@/types';
import { useAtomValue, useSetAtom } from 'jotai';
import { useFormState } from 'react-dom';
import { toast } from 'sonner';

import { isDialogOpenAtom, selectedAlbumAtom } from '@/lib/atoms/albumSettingsDialog';

export const DeleteAlbumAction = () => {
	const setIsDialogOpen = useSetAtom(isDialogOpenAtom);
	const album = useAtomValue(selectedAlbumAtom);

	const [state, formAction] = useFormState(deleteAlbum, {
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
			<input type="hidden" name="uuid" value={album?.uuid} />
			<button type="submit" className="w-full h-full flex px-2 py-1.5">
				Delete album
			</button>
		</form>
	);
};
