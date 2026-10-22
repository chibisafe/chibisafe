import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const getToken = async () => {
	const cookieStore = await cookies();
	const token = cookieStore.get('token')?.value;
	if (!token) redirect('/');
	return token;
};
