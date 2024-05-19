/* eslint-disable promise/prefer-await-to-then */
/* eslint-disable promise/prefer-await-to-callbacks */
'use client';

import { useEffect } from 'react';
import { useAtom } from 'jotai';

import { currentUserAtom } from '@/lib/atoms/currentUser';
import request from '@/lib/request';
import { logout } from '@/lib/logout';
import { toast } from 'sonner';

export function UserProvider({ shouldFetch = false }: { readonly shouldFetch?: boolean }) {
	const [currentUser, setCurrentUser] = useAtom(currentUserAtom);

	useEffect(() => {
		if (!currentUser && shouldFetch) {
			request
				.get({ url: 'v1/users/me' })
				.then(async response => {
					if (response.error) {
						if (response.status === 401) {
							await logout();
						}

						toast.error(response.error);
						return;
					}

					setCurrentUser({
						apiKey: '',
						roles: [],
						token: '',
						username: response.data.username,
						uuid: response.data.uuid
					});
				})
				.catch((error: any) => {
					toast.error(error);
				});
		}
	}, [currentUser, setCurrentUser, shouldFetch]);

	return null;
}
