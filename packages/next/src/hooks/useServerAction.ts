'use client';

import { MessageType } from '@/types';
import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';

export const useServerAction = ({ action, uuid }: { action: any; uuid: string }) => {
	const [state, formAction, isPending] = useActionState(action.bind(null, uuid), {
		message: '',
		type: MessageType.Uninitialized
	});

	useEffect(() => {
		if (state.type === MessageType.Error) toast.error(state.message);
		else if (state.type === MessageType.Success) {
			toast.success(state.message);
		}

		return () => {
			if (state.type !== MessageType.Uninitialized) {
				state.type = MessageType.Uninitialized;
				state.message = '';
			}
		};
	}, [state.message, state.type, state]);

	return { formAction, isPending, state };
};
