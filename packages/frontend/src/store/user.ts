import { defineStore } from 'pinia';
import type { User } from '~/types';
import { login, getMe } from '~/use/api';

export const useUserStore = defineStore('user', {
	state: () => ({
		user: {} as User,
		preferences: {
			preferMasonry: true
		}
	}),
	actions: {
		async checkToken() {
			const user = localStorage.getItem('chibisafe-user');
			if (user) {
				const { token } = JSON.parse(user);
				if (!token) return;
				this.user.token = token;
				// eslint-disable-next-line @typescript-eslint/no-use-before-define
				await this.loginWithToken();

				// Let's assume there are preferences saved
				this.loadPreferences();
			}
		},
		async loginWithToken() {
			const response = await getMe();
			if (!response) {
				return;
			}

			this.user = {
				// Keep the token
				...this.user,
				// Update the rest of the user object
				...response.user,
				// Quota information
				storageQuota: {
					...response.storageQuota
				},
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
				...response.user,
				token: response.token,
				loggedIn: true
			};

			localStorage.setItem(
				'chibisafe-user',
				JSON.stringify({
					id: this.user.id,
					username: this.user.username,
					uuid: this.user.uuid,
					apiKey: this.user.apiKey,
					roles: this.user.roles,
					token: this.user.token
				})
			);
		},
		savePreferences() {
			localStorage.setItem('chibisafe-preferences', JSON.stringify(this.preferences));
		},
		loadPreferences() {
			const preferences = localStorage.getItem('chibisafe-preferences');
			if (preferences) {
				this.preferences = JSON.parse(preferences);
			}
		},
		logout() {
			localStorage.removeItem('chibisafe-user');
			localStorage.removeItem('chibisafe-preferences');
			window.location.href = '/';
		}
	}
});
