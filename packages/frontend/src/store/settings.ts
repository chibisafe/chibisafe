import { defineStore } from 'pinia';
import { getSettings } from '~/use/api';

export const useSettingsStore = defineStore('settings', {
	state: () => ({
		serviceName: '',
		maxFileSize: 0,
		chunkSize: 0,
		logo: '',
		background: ''
	}),
	actions: {
		async get() {
			const response = await getSettings();
			if (!response) return;

			this.serviceName = response.serviceName;
			this.maxFileSize = response.maxFileSize;
			this.chunkSize = response.chunkSize;
			this.logo = response.logo;
			this.background = response.background;
		}
	}
});
