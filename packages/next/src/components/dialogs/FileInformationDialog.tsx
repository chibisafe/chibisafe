'use client';

import { useRef } from 'react';
import type { FilePropsType, FileWithAdditionalData } from '@/types';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';

export function FileInformationDialog({
	file,
	type
}: {
	readonly file: FileWithAdditionalData;
	readonly type: FilePropsType;
}) {
	const ref = useRef<HTMLButtonElement>(null);

	return (
		<Dialog>
			<DialogTrigger ref={ref} className="w-full h-full absolute pointer-events-none">
				<a
					className="w-full h-full absolute top-0 left-0 pointer-events-auto"
					href={file.url}
					target="_blank"
					rel="noopener noreferrer"
					onClick={e => {
						e.preventDefault();
						e.stopPropagation();
						ref.current?.click();
					}}
				/>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you absolutely sure?</DialogTitle>
					<DialogDescription>
						This action cannot be undone. This will permanently delete your account and remove your data
						from our servers.
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}
