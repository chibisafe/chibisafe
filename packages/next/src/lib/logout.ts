'use server';

import { cookies } from 'next/headers';

export const logout = async () => {
	const cookieStore = cookies();
	cookieStore.delete('token');
};
