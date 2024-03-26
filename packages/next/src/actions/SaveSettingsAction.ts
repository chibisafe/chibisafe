'use server';

import { revalidateTag } from 'next/cache';

export const saveSettings = () => {
	revalidateTag('settings');
};
