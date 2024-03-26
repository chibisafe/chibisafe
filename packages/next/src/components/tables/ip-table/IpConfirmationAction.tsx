'use client';

import type { PropsWithChildren } from 'react';
import { useEffect, useRef } from 'react';
import { banIp, purgeIp, unbanIp } from '@/actions/IpActions';
import { MessageType } from '@/types';
import { useFormState } from 'react-dom';
import { toast } from 'sonner';

import { ConfirmationDialog } from '@/components/dialogs/ConfirmationDialog';

export const IpConfirmationAction = ({
	ip,
	type,
	description,
	children
}: PropsWithChildren<{ readonly description: string; readonly ip: string; readonly type: string }>) => {
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
			<input type="hidden" name="ip" value={ip} />
			<ConfirmationDialog description={description} callback={() => formRef.current?.requestSubmit()}>
				<button type="button" className="w-full h-full flex px-2 py-1.5 cursor-default">
					{children}
				</button>
			</ConfirmationDialog>
		</form>
	);
};
