/* eslint-disable promise/prefer-await-to-then */
/* eslint-disable promise/prefer-await-to-callbacks */
'use client';

import { useEffect } from 'react';
import { useAtom } from 'jotai';

import { currentUserAtom } from '@/lib/atoms/currentUser';
import request from '@/lib/request';
import { logout } from '@/lib/logout';

export function UserProvider({ shouldFetch = false }: { readonly shouldFetch?: boolean }) {
	const [currentUser, setCurrentUser] = useAtom(currentUserAtom);

	useEffect(() => {
		if (!currentUser && shouldFetch) {
			request
				.get('user/me')
				.then(response => {
					setCurrentUser(response.user);
				})
				.catch(async (error: any) => {
					// TODO: If error 401 we need to log out
					await logout();
				});
		}
	}, [currentUser, setCurrentUser, shouldFetch]);

	return null;
}
