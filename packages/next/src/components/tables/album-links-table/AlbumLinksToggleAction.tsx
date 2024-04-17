'use client';

import type { PropsWithChildren } from 'react';
import { useEffect, useRef, useState } from 'react';
import { MessageType } from '@/types';
import { useFormState } from 'react-dom';
import { toast } from 'sonner';

import { toggleEnabled } from '@/actions/AlbumSettingsDialogActions';
import { useQueryClient } from '@tanstack/react-query';
import { Switch } from '@/components/ui/switch';

export const AlbumLinksToggleAction = ({
	uuid,
	albumUuid,
	initialEnabled = false
}: PropsWithChildren<{
	readonly albumUuid: string;
	readonly initialEnabled: boolean;
	readonly uuid: string;
}>) => {
	const [state, formAction] = useFormState(toggleEnabled, {
		message: '',
		type: MessageType.Uninitialized
	});

	const [enabled, setEnabled] = useState(initialEnabled);

	const queryClient = useQueryClient();

	const formRef = useRef<HTMLFormElement>(null);

	useEffect(() => {
		if (state.type === MessageType.Error) toast.error(state.message);
		else if (state.type === MessageType.Success) {
			toast.success(state.message);
			void queryClient.invalidateQueries({ queryKey: ['albums', albumUuid, 'links'] });
		}

		return () => {
			if (state.type === MessageType.Success) {
				state.type = MessageType.Uninitialized;
				state.message = '';
			}
		};
	}, [state.message, state.type, state, queryClient, albumUuid]);

	return (
		<form action={formAction} ref={formRef} className="h-full">
			<input type="hidden" name="uuid" value={uuid} />
			<input type="hidden" name="albumUuid" value={albumUuid} />
			<input type="hidden" name="enabled" value={enabled.toString()} />
			<Switch
				checked={enabled}
				onCheckedChange={value => {
					setEnabled(value);
					formRef.current?.requestSubmit();
				}}
			/>
		</form>
	);
};
