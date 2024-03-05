'use client';

import type { PropsWithChildren } from 'react';
import { useEffect, useRef } from 'react';
import { banIp, purgeIp, unbanIp } from '@/actions/IpActions';
import { MessageType } from '@/types';
import { useSetAtom } from 'jotai';
import { useFormState } from 'react-dom';
import { toast } from 'sonner';

import { isDialogOpenAtom } from '@/lib/atoms/fileInformationDialog';
import { ConfirmationDialog } from '@/components/dialogs/ConfirmationDialog';

export const IpConfirmationAction = ({
	ip,
	type,
	description,
	children
}: PropsWithChildren<{ readonly description: string; readonly ip: string; readonly type: string }>) => {
	const setIsDialogOpen = useSetAtom(isDialogOpenAtom);

	let actionToPerform;
	switch (type) {
		case 'ban':
			actionToPerform = banIp;
			break;
		case 'unban':
			actionToPerform = unbanIp;
			break;
		case 'purge':
			actionToPerform = purgeIp;
			break;
		default:
			throw new Error('Invalid type');
	}

	const [state, formAction] = useFormState(actionToPerform, {
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
			<input type="hidden" name="ip" value={ip} />
			<ConfirmationDialog description={description} callback={() => formRef.current?.requestSubmit()}>
				<button type="button" className="w-full h-full flex px-2 py-1.5 cursor-default">
					{children}
				</button>
			</ConfirmationDialog>
		</form>
	);
};
