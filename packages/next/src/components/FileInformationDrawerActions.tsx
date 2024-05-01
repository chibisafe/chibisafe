'use client';

import { type PropsWithChildren } from 'react';
import type { FilePropsType, FileWithAdditionalData } from '@/types';
import { useCopyToClipboard } from 'usehooks-ts';

import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { buttonVariants } from '@/styles/button';
import { RegenerateThumbnailFileInformationAction } from './dialogs/file-information/RegenerateThumbnailFileInformationAction';
import { AllowFileInformationAction } from './dialogs/file-information/AllowFileInformationAction';
import { QuarantineFileInformationAction } from './dialogs/file-information/QuarantineFileInformationAction';
import { DeleteFileInformationAction } from './dialogs/file-information/DeleteFileInformationAction';

export function FileInformationDrawerActions({
	file,
	type
}: PropsWithChildren<{ readonly file: FileWithAdditionalData; readonly type: FilePropsType }>) {
	const [_, copy] = useCopyToClipboard();

	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button variant="secondary">Actions</Button>
			</DrawerTrigger>
			<DrawerContent>
				<div className="p-4 pb-0 grid gap-2 mb-2">
					<Button variant="outline" className="w-full" onClick={() => void copy(file.url)}>
						Copy link
					</Button>

					<a
						href={file.url}
						target="_blank"
						rel="noopener noreferrer"
						className={buttonVariants({ variant: 'outline', className: 'w-full' })}
					>
						Open in new tab
					</a>

					<a
						href={`/api/file/${file.uuid}/download`}
						rel="noopener noreferrer"
						className={buttonVariants({ variant: 'outline', className: 'w-full' })}
					>
						Download
					</a>

					<RegenerateThumbnailFileInformationAction uuid={file.uuid} isDrawer />
					{type === 'admin' || type === 'quarantine' ? (
						<>
							{file.quarantine ? (
								<AllowFileInformationAction uuid={file.uuid} isDrawer />
							) : (
								<QuarantineFileInformationAction uuid={file.uuid} isDrawer />
							)}
						</>
					) : null}
					<DeleteFileInformationAction uuid={file.uuid} type={type} isDrawer />
				</div>
			</DrawerContent>
		</Drawer>
	);
}
