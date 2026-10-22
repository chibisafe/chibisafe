'use server';

import { updateTag } from 'next/cache';

export const saveSettings = async () => {
	updateTag('settings');
};
