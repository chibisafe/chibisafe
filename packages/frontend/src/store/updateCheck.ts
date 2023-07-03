import { defineStore } from 'pinia';
import { checkForUpdate } from '~/use/api';
import type { UpdateCheck } from '@/types';

export const useUpdateStore = defineStore('updateCheck', {
	state: () => ({
		hasChecked: false,
		updateCheck: {} as UpdateCheck
	}),
	actions: {
		async get(force = false) {
			if (!force && this.hasChecked) return;

			const response = await checkForUpdate();
			if (!response) return;
			this.updateCheck = response;
			this.hasChecked = true;
		}
	}
});
