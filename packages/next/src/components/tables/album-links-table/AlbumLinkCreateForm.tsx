import { createAlbumLink } from '@/actions/AlbumSettingsDialogActions';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const AlbumLinkCreateForm = ({ albumUuid }: { readonly albumUuid?: string | undefined }) => {
	return albumUuid ? (
		<form action={createAlbumLink} className="mt-2">
			<input type="hidden" name="uuid" value={albumUuid} />
			<Button type="submit" variant="secondary">
				<Plus className="mr-2 h-4 w-4" />
				Create new link
			</Button>
		</form>
	) : null;
};
