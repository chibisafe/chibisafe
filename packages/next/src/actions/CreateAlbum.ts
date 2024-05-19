'use server';

import { revalidateTag } from 'next/cache';
import { MessageType } from '@/types';
import request from '@/lib/request';
import { getToken } from './utils';

export const createAlbum = async (_: any, form: FormData) => {
	const name = form.get('album') as string;
	const description = form.get('description') as string;
	const isNSFW = form.get('isNSFW') === 'true';

	if (!name) return { message: 'Name is required', type: MessageType.Error };

	try {
		const { error } = await request.post({
			url: 'v1/folders',
			body: {
				name,
				description: description ?? '',
				isNSFW: isNSFW ?? false
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
