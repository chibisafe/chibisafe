'use client';

import type { PropsWithChildren } from 'react';
import { deleteTag } from '@/actions/TagsActions';
import { Tooltip } from '@/components/Tooltip';
import { useSetAtom } from 'jotai';
import { confirmationDialogAtom } from '@/lib/atoms/dialogs/confirmationDialog';
import { useServerAction } from '@/hooks/useServerAction';
import { Button } from '@/components/ui/button';
import { Trash2Icon } from 'lucide-react';

export const DeleteTagButton = ({ uuid }: PropsWithChildren<{ readonly uuid: string }>) => {
	const setConfirmationDialog = useSetAtom(confirmationDialogAtom);
	const { formAction, isPending } = useServerAction({
		action: deleteTag,
		identifier: uuid
	});

	return (
		<Tooltip content="Delete tag">
			<Button
				variant="outline"
				size={'icon'}
				disabled={isPending}
				onClick={() => {
					setConfirmationDialog({
						callback: () => formAction(),
						description: 'Are you sure you want to delete this tag? This will not delete any files.'
					});
				}}
			>
				<Trash2Icon className="h-4 w-4" />
			</Button>
		</Tooltip>
	);
};
