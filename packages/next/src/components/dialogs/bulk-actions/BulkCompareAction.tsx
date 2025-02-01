'use client';

import type { FileWithIndex } from '@/types';

export const BulkCompareAction = ({ files }: { readonly files: FileWithIndex[] }) => {
	const firstTwoFilesOfTypeImage = files.filter(file => file.type.startsWith('image')).slice(0, 2);

	if (firstTwoFilesOfTypeImage.length < 2) {
		return null;
	}

	return (
		<button
			type="submit"
			className="w-full h-full flex px-2 py-1.5 cursor-default"
			onClick={() => {
				const win = window.open(
					`/compare/${firstTwoFilesOfTypeImage[0]?.name}/${firstTwoFilesOfTypeImage[1]?.name}`,
					'_blank'
				);
				if (win !== null) {
					win.focus();
				}
			}}
		>
			Compare images
		</button>
	);
};
