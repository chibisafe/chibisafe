import { type PropsWithChildren } from 'react';
import type { FilePropsType, FileWithAdditionalData } from '@/types';
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

export function FileInformationDialogActions({
	file,
	type
}: PropsWithChildren<{ readonly file: FileWithAdditionalData; readonly type: FilePropsType }>) {
	const [copiedText, copy] = useCopyToClipboard();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline">File actions</Button>
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
					<DropdownMenuItem>Regenerate thumbnail</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				{type === 'uploads' ? (
					<>
						<DropdownMenuGroup>
							{file.quarantine ? (
								<DropdownMenuItem className="focus:text-destructive-foreground focus:bg-destructive">
									Allow file
								</DropdownMenuItem>
							) : (
								<DropdownMenuItem className="focus:text-destructive-foreground focus:bg-destructive">
									Quarantine
								</DropdownMenuItem>
							)}
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
					</>
				) : null}
				<DropdownMenuItem className="focus:text-destructive-foreground focus:bg-destructive">
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
