import { defineStore } from 'pinia';
import type { FileWithAdditionalData } from '~/types';

export const useModalstore = defineStore('modals', {
	state: () => ({
		login: false,
		fileInformation: {
			show: false,
			file: {} as FileWithAdditionalData | null
		}
	}),
	actions: {
		// async get(page = 0) {
		// 	const response = await getFiles(page);
		// 	// TODO: Error handling
		// 	if (!response) return;
		// 	this.files = response.files;
		// 	this.count = response.count;
		// }
	}
});
