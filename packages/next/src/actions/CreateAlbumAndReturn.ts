'use server';

import { revalidateTag } from 'next/cache';
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
				authorization: `Bearer ${getToken()}`
			}
		});

		if (error) return { error };

		revalidateTag('albums');
		return { album: data.album as { uuid: string; name: string } };
	} catch (error: any) {
		return { error: error.message || 'Failed to create album' };
	}
};
