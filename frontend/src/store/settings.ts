import { defineStore } from 'pinia';
import { getSettings } from '~/use/api';

export const useSettingsStore = defineStore('settings', {
	state: () => ({
		maxFileSize: 0,
		chunkSize: 0
	}),
	actions: {
		async get() {
			const response = await getSettings();
			if (!response) return;

			this.maxFileSize = response.maxFileSize;
			this.chunkSize = response.chunkSize;
		}
	}
});
