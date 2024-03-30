/* eslint-disable promise/prefer-await-to-callbacks */
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';

import type { PropsWithChildren } from 'react';
import { Button } from '../ui/button';

export function ConfirmationDialog({
	children,
	title = 'Are you sure?',
	description,
	callback
}: PropsWithChildren<{ readonly callback: any; readonly description: string; readonly title?: string }>) {
	return (
		<>
			<div className="hidden md:inline-flex">
				<AlertDialog>
					<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
					<AlertDialogContent className="w-11/12">
						<AlertDialogHeader>
							<AlertDialogTitle>{title}</AlertDialogTitle>
							<AlertDialogDescription>{description}</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={() => callback()}>Confirm</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
			<div className="inline-flex md:hidden w-full">
				<Drawer>
					<DrawerTrigger asChild>{children}</DrawerTrigger>
					<DrawerContent>
						<div className="grid gap-1.5 py-4 px-8 text-center sm:text-left">
							<h2 className="text-lg font-semibold leading-none tracking-tight">{title}</h2>
							<p className="text-sm text-muted-foreground">{description}</p>
						</div>
						<div className="py-4 px-8">
							<Button type="button" className="mb-4 w-full" onClick={() => callback()}>
								Confirm
							</Button>
						</div>
					</DrawerContent>
				</Drawer>
			</div>
		</>
	);
}
