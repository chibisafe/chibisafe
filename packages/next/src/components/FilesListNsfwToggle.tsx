'use client';

import type { PropsWithChildren } from 'react';
import { useState } from 'react';
import { Button } from './ui/button';

export const FilesListNsfwToggle = ({
	children,
	nsfw = false
	// eslint-disable-next-line @typescript-eslint/promise-function-async
}: PropsWithChildren<{ readonly nsfw?: boolean | undefined }>) => {
	const [showNsfw, setShowNsfw] = useState(false);

	if (nsfw && !showNsfw) {
		return (
			<div className="flex flex-col flex-grow items-center justify-center gap-4">
				<span className="text-red-500">Content hidden</span>
				<p>This album is marked as NSFW so in order to view its contents press the button below.</p>
				<Button type="button" variant="outline" onClick={() => setShowNsfw(true)}>
					Show NSFW
				</Button>
			</div>
		);
	}

	return children;
};
