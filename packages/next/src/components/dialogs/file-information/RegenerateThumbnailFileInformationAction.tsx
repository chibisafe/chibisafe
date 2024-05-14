import { regenerateThumbnail } from '@/actions/FileDialogActions';
import { Button } from '@/components/ui/button';

export const RegenerateThumbnailFileInformationAction = ({
	uuid,
	isDrawer = false
}: {
	readonly isDrawer?: boolean | undefined;
	readonly uuid: string;
}) => {
	const regenerateThumbailWithUuid = regenerateThumbnail.bind(null, uuid);

	return (
		<form action={regenerateThumbailWithUuid} className="w-full h-full">
			{isDrawer ? (
				<Button variant="outline" className="w-full">
					Regenerate Thumbnail
				</Button>
			) : (
				<button type="submit" className="w-full h-full flex px-2 py-1.5 cursor-default">
					Regenerate Thumbnail
				</button>
			)}
		</form>
	);
};
