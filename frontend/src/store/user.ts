import { defineStore } from 'pinia';
import { login, getMe } from '~/use/api';
import type { User } from '~/types';

export const useUserStore = defineStore('user', {
	state: () => ({
		user: {} as User,
		preferences: {
			preferMasonry: true
		}
	}),
	actions: {
		checkToken() {
			const user = localStorage.getItem('chibisafe-user');
			if (user) {
				const { token } = JSON.parse(user);
				if (!token) return;
				this.user.token = token;
				// eslint-disable-next-line @typescript-eslint/no-use-before-define
				void this.loginWithToken();
			}
		},
		async loginWithToken() {
			const response = await getMe();
			if (!response) {
				this.logout();
				return;
			}

			this.user = {
				// Keep the token
				...this.user,
				// Update the rest of the user object
				...response,
				// Set loggedIn to true
				loggedIn: true
			};
		},
		async login(username: string, password: string) {
			if (!username || !password) return;
			const response = await login(username, password);

			if (!response) return;
			if (!response.token) return;

			this.user = {
				...response,
				loggedIn: true
			};

			localStorage.setItem(
				'chibisafe-user',
				JSON.stringify({
					username: this.user.username,
					uuid: this.user.uuid,
					apiKey: this.user.apiKey,
					isAdmin: this.user.isAdmin,
					token: this.user.token
				})
			);
		},
		logout() {
			localStorage.removeItem('chibisafe-user');
			window.location.href = '/';
		}
	}
});
