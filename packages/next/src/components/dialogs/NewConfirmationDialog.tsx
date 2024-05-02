'use client';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Drawer, DrawerContent } from '@/components/ui/drawer';

import { Button } from '../ui/button';
import { useAtom } from 'jotai';
import { confirmationDialogAtom } from '@/lib/atoms/dialogs/confirmationDialog';
import { useMediaQuery } from 'usehooks-ts';
import { useEffect, useState } from 'react';

export function ConfirmationDialog() {
	const [open, setOpen] = useState(false);
	const [confirmationDialog, setConfirmationDialog] = useAtom(confirmationDialogAtom);
	const closeDialog = () =>
		setConfirmationDialog({
			callback: null,
			description: '',
			title: ''
		});
	const doCallback = () => {
		confirmationDialog.callback();
		closeDialog();
	};

	const isMobile = useMediaQuery('(max-width: 768px)');

	useEffect(() => {
		setOpen(Boolean(confirmationDialog.callback));
	}, [confirmationDialog.callback]);

	return isMobile ? (
		<Drawer open={open} onClose={() => closeDialog()}>
			<DrawerContent>
				<div className="grid gap-1.5 py-4 px-8 text-center sm:text-left">
					<h2 className="text-lg font-semibold leading-none tracking-tight">
						{confirmationDialog.title ?? 'Are you sure?'}
					</h2>
					<p className="text-sm text-muted-foreground">{confirmationDialog.description}</p>
				</div>
				<div className="py-4 px-8 flex flex-col gap-2 mb-4">
					<Button type="button" variant="secondary" className="w-full" onClick={() => closeDialog()}>
						Cancel
					</Button>
					<Button type="button" className="w-full" onClick={() => doCallback()}>
						Confirm
					</Button>
				</div>
			</DrawerContent>
		</Drawer>
	) : (
		<AlertDialog open={open}>
			<AlertDialogContent className="w-11/12">
				<AlertDialogHeader>
					<AlertDialogTitle>{confirmationDialog.title ?? 'Are you sure?'}</AlertDialogTitle>
					<AlertDialogDescription>{confirmationDialog.description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={() => closeDialog()}>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={() => doCallback()}>Confirm</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
