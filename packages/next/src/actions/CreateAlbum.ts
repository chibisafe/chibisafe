'use server';

import { revalidateTag } from 'next/cache';
import { MessageType } from '@/types';
import request from '@/lib/request';
import { getToken } from './utils';

export const createAlbum = async (_: any, form: FormData) => {
	const name = form.get('album') as string;
	if (!name) return { message: 'Name is required', type: MessageType.Error };

	try {
		const { error } = await request.post({
			url: 'album/create',
			body: {
				name
			},
			headers: {
				authorization: `Bearer ${getToken()}`
			}
		});

		if (error) return { message: error, type: MessageType.Error };

		revalidateTag('albums');
		return { message: 'Album created', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};
