import { defineStore } from 'pinia';
import type { Toast } from '~/types';

let toastId = 0;

export const useToastStore = defineStore('toast', {
	state: () => ({
		toasts: [] as Toast[]
	}),
	actions: {
		error(message: string) {
			this.toasts.push({
				type: 'error',
				message,
				id: toastId++
			});

			const newToastId = toastId - 1;
			// eslint-disable-next-line no-restricted-globals
			setTimeout(() => this.dismiss(newToastId), 5000);
		},
		dismiss(id: number) {
			this.toasts = this.toasts.filter(toast => toast.id !== id);
		}
	}
});
