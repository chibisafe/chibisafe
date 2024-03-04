'use client';

import { type PropsWithChildren } from 'react';
import { type FilePropsType, type FileWithAdditionalData } from '@/types';
import { useCopyToClipboard } from 'usehooks-ts';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { AllowFileInformationAction } from './dialogs/file-information/AllowFileInformationAction';
import { DeleteFileInformationAction } from './dialogs/file-information/DeleteFileInformationAction';
import { QuarantineFileInformationAction } from './dialogs/file-information/QuarantineFileInformationAction';
import { RegenerateThumbnailFileInformationAction } from './dialogs/file-information/RegenerateThumbnailFileInformationAction';

export function FileInformationDialogActions({
	file,
	type
}: PropsWithChildren<{ readonly file: FileWithAdditionalData; readonly type: FilePropsType }>) {
	const [copiedText, copy] = useCopyToClipboard();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="secondary">Actions</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuGroup>
					<DropdownMenuItem onClick={() => void copy(file.url)}>Copy link</DropdownMenuItem>
					<DropdownMenuItem onClick={() => window.open(file.url, '_blank')}>Open in new tab</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<a href={file.url} download>
							Download
						</a>
					</DropdownMenuItem>
					<DropdownMenuItem className="p-0">
						<RegenerateThumbnailFileInformationAction uuid={file.uuid} />
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				{type === 'uploads' ? (
					<>
						<DropdownMenuGroup>
							{file.quarantine ? (
								<DropdownMenuItem
									className="focus:text-destructive-foreground focus:bg-destructive p-0"
									onSelect={e => e.preventDefault()}
								>
									<AllowFileInformationAction uuid={file.uuid} />
								</DropdownMenuItem>
							) : (
								<DropdownMenuItem
									className="focus:text-destructive-foreground focus:bg-destructive p-0"
									onSelect={e => e.preventDefault()}
								>
									<QuarantineFileInformationAction uuid={file.uuid} />
								</DropdownMenuItem>
							)}
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
					</>
				) : null}
				<DropdownMenuItem
					className="focus:text-destructive-foreground focus:bg-destructive p-0"
					onSelect={e => e.preventDefault()}
				>
					<DeleteFileInformationAction uuid={file.uuid} />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
