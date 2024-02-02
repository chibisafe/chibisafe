'use server';

import { cookies } from "next/headers";

export const logout = () => {
	const cookieStore = cookies();
	cookieStore.delete('token');
}
