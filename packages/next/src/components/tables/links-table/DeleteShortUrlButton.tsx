'use client';

import type { PropsWithChildren } from 'react';
import { deleteLink, deleteLinkAsAdmin } from '@/actions/LinksActions';
import { useSetAtom } from 'jotai';
import { confirmationDialogAtom } from '@/lib/atoms/dialogs/confirmationDialog';
import { useServerAction } from '@/hooks/useServerAction';
import { Button } from '@/components/ui/button';
import { Trash2Icon } from 'lucide-react';

export const DeleteShortUrlButton = ({
	identifier,
	isAdmin
}: PropsWithChildren<{
	readonly identifier: string;
	readonly isAdmin?: boolean | undefined;
}>) => {
	const setConfirmationDialog = useSetAtom(confirmationDialogAtom);
	const { formAction, isPending } = useServerAction({
		action: isAdmin ? deleteLinkAsAdmin : deleteLink,
		identifier
	});

	return (
		<Button
			variant="outline"
			disabled={isPending}
			size="icon"
			onClick={() => {
				setConfirmationDialog({
					callback: () => formAction(),
					description: 'Are you sure you want to delete this URL?'
				});
			}}
		>
			<Trash2Icon className="h-4 w-4" />
		</Button>
	);
};
