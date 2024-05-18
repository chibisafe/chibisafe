'use server';
import { cookies } from 'next/headers';

export const setLanguage = (lang: string) => {
	const cookieStore = cookies();
	cookieStore.set('lang', lang);
};
