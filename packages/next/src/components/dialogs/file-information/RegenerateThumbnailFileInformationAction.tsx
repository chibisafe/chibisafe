import { regenerateThumbnail } from '@/actions/FileInformationDialogActions';

export const RegenerateThumbnailFileInformationAction = ({ uuid }: { readonly uuid: string }) => {
	const regenerateThumbailWithUuid = regenerateThumbnail.bind(null, uuid);

	return (
		<form action={regenerateThumbailWithUuid} className="w-full h-full">
			<button type="submit" className="w-full h-full flex px-2 py-1.5 cursor-default">
				Regenerate Thumbnail
			</button>
		</form>
	);
};
