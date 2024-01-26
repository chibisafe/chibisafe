import Cookies from 'js-cookie';
import { toast } from 'sonner';
import type { LocalStorageUser } from '~/types';

// import { request } from './useFetch';

export const useAuth = () => {
	// eslint-disable-next-line unicorn/consistent-function-scoping
	const login = async ({ username, password }: { password: string; username: string }) => {
		try {
			const response = await fetch('/api/auth/login', {
				body: JSON.stringify({ username, password }),
				headers: {
					'Content-Type': 'application/json'
				},
				method: 'POST'
			});

			const data = await response.json();

			Cookies.set('user', JSON.stringify({ ...data.user, token: data.token, expiresAt: data.expiresAt }));

			return data.user as LocalStorageUser;
		} catch (error: any) {
			toast.error(error.message);
			return null;
		}
	};

	// eslint-disable-next-line unicorn/consistent-function-scoping
	const logout = () => {
		Cookies.remove('user');
	};

	return { login, logout };
};
