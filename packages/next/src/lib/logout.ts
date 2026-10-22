'use server';

import { cookies } from 'next/headers';

export const logout = async () => {
	const cookieStore = await cookies();
	cookieStore.delete('token');
};
