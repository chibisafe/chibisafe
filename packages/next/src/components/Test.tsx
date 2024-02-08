'use client';

import { useAtomValue } from 'jotai';

import { uploadsAtom } from '@/lib/atoms/uploads';

export const Test = () => {
	const uploads = useAtomValue(uploadsAtom);
	return (
		<ul>
			{uploads.map(file => (
				<li key={file.uuid}>{file.name}</li>
			))}
		</ul>
	);
};
