'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { MessageType } from '@/types';

import request from '@/lib/request';

export const createAlbum = async (_: any, form: FormData) => {
	const cookieStore = cookies();
	const token = cookieStore.get('token')?.value;
	if (!token) redirect('/');

	const name = form.get('album') as string;
	if (!name) return { message: 'Name is required', type: MessageType.Error };

	try {
		await request.post(
			'album/create',
			{
				name
			},
			{
				authorization: `Bearer ${token}`
			}
		);

		revalidateTag('albums');
		return { message: 'Album created', type: MessageType.Success };
	} catch (error: any) {
		return { message: error.message, type: MessageType.Error };
	}
};
