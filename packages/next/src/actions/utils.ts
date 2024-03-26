import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const getToken = () => {
	const cookieStore = cookies();
	const token = cookieStore.get('token')?.value;
	if (!token) redirect('/');
	return token;
};
