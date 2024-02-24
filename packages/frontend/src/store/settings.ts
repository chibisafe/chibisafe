import { defineStore } from 'pinia';
import { getSettings } from '~/use/api';

export const useSettingsStore = defineStore('settings', {
	state: () => ({
		serviceName: '',
		maxSize: 0,
		chunkSize: 0,
		logoURL: '',
		backgroundImageURL: '',
		publicMode: false,
		userAccounts: false,
		blockedExtensions: [''],
		useNetworkStorage: false
	}),
	actions: {
		async get() {
			const response = await getSettings();
			if (!response) return;

			this.serviceName = response.serviceName;
			this.maxSize = response.maxSize;
			this.chunkSize = response.chunkSize;
			this.logoURL = response.logoURL;
			this.backgroundImageURL = response.backgroundImageURL;
			this.publicMode = response.publicMode;
			this.userAccounts = response.userAccounts;
			this.blockedExtensions = response.blockedExtensions;
			this.useNetworkStorage = response.useNetworkStorage;
		}
	}
});
