'use client';

import { type PropsWithChildren } from 'react';
import type { FilePropsType, FileWithAdditionalData } from '@/types';
import { useCopyToClipboard } from 'usehooks-ts';

import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';

export function FileInformationDrawerActions({
	file,
	type
}: PropsWithChildren<{ readonly file: FileWithAdditionalData; readonly type: FilePropsType }>) {
	const [copiedText, copy] = useCopyToClipboard();

	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button variant="secondary">Actions</Button>
			</DrawerTrigger>
			<DrawerContent>
				<div className="p-4 pb-0 grid gap-2">
					<Button variant="outline" className="w-full" onClick={() => void copy(file.url)}>
						Copy link
					</Button>
					<Button variant="outline" className="w-full" onClick={() => window.open(file.url, '_blank')}>
						Open in new tab
					</Button>

					<Button variant="outline" className="w-full" asChild>
						<a href={file.url} download>
							Download
						</a>
					</Button>

					<Button variant="outline" className="w-full">
						Regenerate thumbnail
					</Button>
					{/* <Separator /> */}
					{type === 'uploads' ? (
						<>
							{file.quarantine ? (
								<Button variant="destructive" className="w-full mt-2">
									Allow file
								</Button>
							) : (
								<Button variant="destructive" className="w-full mt-2">
									Quarantine
								</Button>
							)}
							{/* <Separator /> */}
						</>
					) : null}
					<Button variant="destructive" className="w-full mb-6">
						Delete
					</Button>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
