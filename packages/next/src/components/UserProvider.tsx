'use client';

import { useEffect } from 'react';
import { useAtom } from 'jotai';

import { getMe } from '@/lib/api';
import { currentUserAtom } from '@/lib/atoms/currentUser';

export function UserProvider({ shouldFetch = false }: { readonly shouldFetch?: boolean }) {
	const [currentUser, setCurrentUser] = useAtom(currentUserAtom);

	useEffect(() => {
		if (!currentUser && shouldFetch) {
			getMe()
				// eslint-disable-next-line promise/prefer-await-to-then
				.then(response => {
					setCurrentUser(response.user);
				})
				// eslint-disable-next-line promise/prefer-await-to-then
				.catch(() => {});
		}
	}, [currentUser, setCurrentUser, shouldFetch]);

	return null;
}
