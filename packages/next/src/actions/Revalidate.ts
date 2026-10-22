'use server';

import { updateTag } from 'next/cache';

export const customRevalidateTag = async (tag: string) => {
	updateTag(tag);
};
