import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import type { LocalStorageUser } from '~/types';

export const useCurrentUser = () => {
	const [user, setUser] = useState<LocalStorageUser | null>(null);

	useEffect(() => {
		const userCookie = Cookies.get('user');

		if (userCookie) {
			setUser(JSON.parse(userCookie));
		}
	}, []);

	return user;
};
