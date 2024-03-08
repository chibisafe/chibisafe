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

export const createSnippet = async (_: any, form: FormData) => {
	const name = form.get('name') as string;
	const content = form.get('content') as string;
	const language = form.get('language') as string;
	if (!name) return { message: 'Name is required', type: MessageType.Error };
	if (!content) return { message: 'Content is required', type: MessageType.Error };

	try {
		await request.post(
			'snippet/create',
			{
				name,
				content,
				language: language ?? 'auto-detect'
			},
			{
				authorization: `Bearer ${getToken()}`
			},
			{
				next: {
					tags: ['snippets']
				}
			}
		);

		revalidateTag('snippets');
		return { message: 'Snippet created', type: MessageType.Success };
	} catch (error: any) {
		return { message: error.message, type: MessageType.Error };
	}
};

export const deleteSnippet = async (_: any, form: FormData) => {
	const uuid = form.get('uuid') as string;

	try {
		await request.delete(
			`snippet/${uuid}`,
			{},
			{
				authorization: `Bearer ${getToken()}`
			},
			{
				next: {
					tags: ['snippets']
				}
			}
		);

		revalidateTag('snippets');
		return { message: 'Snippet deleted', type: MessageType.Success };
	} catch (error: any) {
		return { message: error.message, type: MessageType.Error };
	}
};
