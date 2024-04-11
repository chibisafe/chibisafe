'use client';

import { currentUserAtom } from '@/lib/atoms/currentUser';
import { settingsAtom } from '@/lib/atoms/settings';
import { useAtomValue } from 'jotai';
import Link from 'next/link';

export const GlobalAdminNotice = () => {
	const settings = useAtomValue(settingsAtom);
	const currentUser = useAtomValue(currentUserAtom);

	if (settings?.serveUploadsFrom || !currentUser?.roles.some(role => role.name === 'admin')) {
		return null;
	}

	return (
		<div className="bg-yellow-700 text-white p-2 text-center text-sm">
			Files and thumbnails will be broken until you add your full domain in{' '}
			<Link href="/dashboard/admin/settings" className="underline">
				Settings {'>'} Service {'>'} Serve uploads from
			</Link>
		</div>
	);
};
