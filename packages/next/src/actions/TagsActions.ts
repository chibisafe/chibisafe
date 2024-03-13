'use server';

import { revalidateTag } from 'next/cache';
import { MessageType } from '@/types';
import request from '@/lib/request';
import { getToken } from './utils';

export const createTag = async (_: any, form: FormData) => {
	const name = form.get('name') as string;
	if (!name) return { message: 'Name is required', type: MessageType.Error };

	try {
		const { error } = await request.post(
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

		if (error) return { message: error, type: MessageType.Error };

		revalidateTag('tags');
		return { message: 'Tag created', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const deleteTag = async (_: any, form: FormData) => {
	const uuid = form.get('uuid') as string;

	try {
		const { error } = await request.delete(
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

		if (error) return { message: error, type: MessageType.Error };

		revalidateTag('tags');
		return { message: 'Tag deleted', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};
