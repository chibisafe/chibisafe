'use server';

import { revalidateTag } from 'next/cache';
import { MessageType } from '@/types';
import request from '@/lib/request';
import { getToken } from './utils';

export const updateAlbumSettings = async (_: any, form: FormData) => {
	const uuid = form.get('uuid') as string;

	const name = form.get('name') as string;
	if (!name) return { message: 'Name is required', type: MessageType.Error };

	const description = form.get('description') as string;
	const nsfw = form.get('nsfw') === 'on';

	try {
		const { error } = await request.post({
			url: `album/${uuid}/edit`,
			body: {
				name,
				description,
				nsfw
			},
			headers: {
				authorization: `Bearer ${getToken()}`
			}
		});

		if (error) return { message: error, type: MessageType.Error };

		revalidateTag('albums');
		return { message: 'Album updated', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};
