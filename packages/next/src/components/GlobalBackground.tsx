'use client';

import { settingsAtom } from '@/lib/atoms/settings';
import { useAtomValue } from 'jotai';
import { usePathname } from 'next/navigation';

export const GlobalBackground = () => {
	const settings = useAtomValue(settingsAtom);
	const pathname = usePathname();

	if (settings?.backgroundImageURL && !pathname.startsWith('/guides')) {
		return (
			<div
				className="fixed inset-0 z-[-1] bg-no-repeat bg-center bg-cover"
				style={{ backgroundImage: `url(${settings.backgroundImageURL})` }}
			/>
		);
	}

	return null;
};
