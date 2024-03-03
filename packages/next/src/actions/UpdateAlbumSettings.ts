'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { MessageType } from '@/types';

import request from '@/lib/request';

export const updateAlbumSettings = async (_: any, form: FormData) => {
	const cookieStore = cookies();
	const token = cookieStore.get('token')?.value;
	if (!token) redirect('/');

	const uuid = form.get('uuid') as string;

	const name = form.get('name') as string;
	if (!name) return { message: 'Name is required', type: MessageType.Error };

	const description = form.get('description') as string;
	const nsfw = form.get('nsfw') === 'on';

	try {
		await request.post(
			`album/${uuid}/edit`,
			{
				name,
				description,
				nsfw
			},
			{
				authorization: `Bearer ${token}`
			}
		);

		revalidateTag('albums');
		return { message: 'Album updated', type: MessageType.Success };
	} catch (error: any) {
		return { message: error.message, type: MessageType.Error };
	}
};
