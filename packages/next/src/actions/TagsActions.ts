'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { MessageType } from '@/types';

import request from '@/lib/request';

const getToken = () => {
	const cookieStore = cookies();
	const token = cookieStore.get('token')?.value;
	if (!token) redirect('/');
	return token;
};

export const createTag = async (_: any, form: FormData) => {
	const name = form.get('name') as string;
	if (!name) return { message: 'Name is required', type: MessageType.Error };

	try {
		await request.post(
			'tag/create',
			{
				name
			},
			{
				authorization: `Bearer ${getToken()}`
			},
			{
				next: {
					tags: ['tags']
				}
			}
		);

		revalidateTag('tags');
		return { message: 'Tag created', type: MessageType.Success };
	} catch (error: any) {
		return { message: error.message, type: MessageType.Error };
	}
};

export const deleteTag = async (_: any, form: FormData) => {
	const uuid = form.get('uuid') as string;

	try {
		await request.delete(
			`tag/${uuid}`,
			{},
			{
				authorization: `Bearer ${getToken()}`
			},
			{
				next: {
					tags: ['tags']
				}
			}
		);

		revalidateTag('tags');
		return { message: 'Tag deleted', type: MessageType.Success };
	} catch (error: any) {
		return { message: error.message, type: MessageType.Error };
	}
};
