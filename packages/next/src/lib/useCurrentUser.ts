import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import type { LocalStorageUser } from '~/types';

import { debug } from '@/lib/utils';

export const useCurrentUser = () => {
	const [user, setUser] = useState<LocalStorageUser | null>(null);

	useEffect(() => {
		const userCookie = Cookies.get('user');

		if (userCookie) {
			setUser(JSON.parse(userCookie));
			debug('user', JSON.parse(userCookie));
		}
	}, []);

	return user;
};
