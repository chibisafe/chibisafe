import Cookies from 'js-cookie';
import { toast } from 'sonner';
import type { LocalStorageUser } from '~/types';

import { request } from './fetch';

export const useAuth = () => {
	// eslint-disable-next-line unicorn/consistent-function-scoping
	const login = async ({ username, password }: { password: string; username: string }) => {
		try {
			const response = await request.post('auth/login', {
				username,
				password
			});

			Cookies.set(
				'user',
				JSON.stringify({ ...response.user, token: response.token, expiresAt: response.expiresAt })
			);

			return response.user as LocalStorageUser;
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
