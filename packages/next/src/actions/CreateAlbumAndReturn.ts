'use server';

import { updateTag } from 'next/cache';
import request from '@/lib/request';
import { getToken } from './utils';

export const createAlbumAndReturn = async (name: string) => {
	if (!name) return { error: 'Name is required' };

	try {
		const { data, error } = await request.post({
			url: 'album/create',
			body: {
				name
			},
			headers: {
				authorization: `Bearer ${await getToken()}`
			}
		});

		if (error) return { error };

		updateTag('albums');
		return { album: data.album as { name: string; uuid: string } };
	} catch (error: any) {
		return { error: error.message || 'Failed to create album' };
	}
};
