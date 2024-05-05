'use client';

import type { PropsWithChildren } from 'react';
import { revokeInvite } from '@/actions/InviteActions';
import { Button } from '@/components/ui/button';
import { Trash2Icon } from 'lucide-react';
import { confirmationDialogAtom } from '@/lib/atoms/dialogs/confirmationDialog';
import { useSetAtom } from 'jotai';
import { useServerAction } from '@/hooks/useServerAction';

export const InvitesConfirmationAction = ({ code }: PropsWithChildren<{ readonly code: string }>) => {
	const setConfirmationDialog = useSetAtom(confirmationDialogAtom);
	const { formAction, isPending } = useServerAction({
		action: revokeInvite,
		identifier: code
	});

	return (
		<Button
			variant="outline"
			size="icon"
			disabled={isPending}
			onClick={() =>
				setConfirmationDialog({
					callback: () => formAction(),
					description:
						'Are you sure you want to revoke this invite? It will prevent anyone from using it to create an account.'
				})
			}
		>
			<Trash2Icon className="h-4 w-4" />
		</Button>
	);
};
