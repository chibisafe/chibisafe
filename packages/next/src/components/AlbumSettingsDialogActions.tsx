'use client';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { buttonVariants } from '@/styles/button';
import { cn } from '@/lib/utils';
import { useAtomValue, useSetAtom } from 'jotai';
import { confirmationDialogAtom } from '@/lib/atoms/dialogs/confirmationDialog';
import { useServerAction } from '@/hooks/useServerAction';
import { deleteAlbum, deleteAlbumAndFiles } from '@/actions/AlbumSettingsDialogActions';
import { useEffect } from 'react';
import { MessageType } from '@/types';
import { isDialogOpenAtom, selectedAlbumAtom } from '@/lib/atoms/albumSettingsDialog';
import { useMediaQuery } from 'usehooks-ts';
import { Drawer, DrawerContent, DrawerTrigger } from './ui/drawer';

const DeleteAlbumButton = ({
	className,
	isMobile = false
}: {
	readonly className?: string;
	readonly isMobile?: boolean;
}) => {
	const setConfirmationDialog = useSetAtom(confirmationDialogAtom);
	const setIsDialogOpen = useSetAtom(isDialogOpenAtom);
	const album = useAtomValue(selectedAlbumAtom);

	const { formAction, isPending, state } = useServerAction({
		action: deleteAlbum,
		identifier: album?.uuid ?? ''
	});

	useEffect(() => {
		if (state.type === MessageType.Success) {
			setIsDialogOpen(false);
		}
	}, [state.type, setIsDialogOpen]);

	return (
		<button
			type="button"
			disabled={isPending}
			className={cn(isMobile ? buttonVariants({ variant: 'destructive' }) : null, 'w-full', className)}
			onClick={() =>
				setConfirmationDialog({
					callback: () => formAction(),
					description: 'This action will delete the album.'
				})
			}
		>
			Delete album
		</button>
	);
};

const DeleteAlbumAndFilesButton = ({
	className,
	isMobile = false
}: {
	readonly className?: string;
	readonly isMobile?: boolean;
}) => {
	const setConfirmationDialog = useSetAtom(confirmationDialogAtom);
	const setIsDialogOpen = useSetAtom(isDialogOpenAtom);
	const album = useAtomValue(selectedAlbumAtom);

	const { formAction, isPending, state } = useServerAction({
		action: deleteAlbumAndFiles,
		identifier: album?.uuid ?? ''
	});

	useEffect(() => {
		if (state.type === MessageType.Success) {
			setIsDialogOpen(false);
		}
	}, [state.type, setIsDialogOpen]);

	return (
		<button
			type="button"
			disabled={isPending}
			className={cn(isMobile ? buttonVariants({ variant: 'destructive' }) : null, 'w-full', className)}
			onClick={() =>
				setConfirmationDialog({
					callback: () => formAction(),
					description: 'This action will delete the album and all its files.'
				})
			}
		>
			Delete album and files
		</button>
	);
};

export function AlbumSettingsDialogActions() {
	const isMobile = useMediaQuery('(max-width: 768px)');

	return isMobile ? (
		<Drawer>
			<DrawerTrigger asChild>
				<Button variant="secondary">Actions</Button>
			</DrawerTrigger>
			<DrawerContent>
				<div className="p-4 pb-0 grid gap-2 mb-2">
					<DeleteAlbumButton isMobile={true} />
					<DeleteAlbumAndFilesButton isMobile={true} />
				</div>
			</DrawerContent>
		</Drawer>
	) : (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="secondary">Actions</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuItem
					className="focus:text-destructive-foreground focus:bg-destructive p-0"
					onSelect={e => e.preventDefault()}
				>
					<DeleteAlbumButton className="h-full flex px-2 py-1.5 cursor-default" />
				</DropdownMenuItem>
				<DropdownMenuItem
					className="focus:text-destructive-foreground focus:bg-destructive p-0"
					onSelect={e => e.preventDefault()}
				>
					<DeleteAlbumAndFilesButton className="h-full flex px-2 py-1.5 cursor-default" />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
