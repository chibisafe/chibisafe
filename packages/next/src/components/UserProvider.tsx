'use client'

import { useAtom } from "jotai";
import { useEffect } from "react";
import { getMe } from "~/lib/api";
import { currentUserAtom } from "~/lib/useCurrentUser";

export function UserProvider() {
	const [currentUser, setCurrentUser] = useAtom(currentUserAtom);

	useEffect(() => {
		if (!currentUser) {
			// eslint-disable-next-line promise/prefer-await-to-then
			getMe().then(response => {
				setCurrentUser(response.user);
			// eslint-disable-next-line promise/prefer-await-to-then
			}).catch(() => {});
		}
	}, [currentUser, setCurrentUser]);

  	return null;
}
