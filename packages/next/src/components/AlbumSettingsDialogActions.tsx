import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { DeleteAlbumAction } from './dialogs/album-settings/DeleteAlbumAction';
import { DeleteAlbumAndFilesAction } from './dialogs/album-settings/DeleteAlbumAndFilesAction';

export function AlbumSettingsDialogActions() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="secondary">Actions</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuItem className="focus:text-destructive-foreground focus:bg-destructive p-0">
					<DeleteAlbumAction />
				</DropdownMenuItem>
				<DropdownMenuItem className="focus:text-destructive-foreground focus:bg-destructive p-0">
					<DeleteAlbumAndFilesAction />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
