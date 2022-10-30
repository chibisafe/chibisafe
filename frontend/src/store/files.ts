import { defineStore } from 'pinia';
import { getFiles } from '~/use/api';
import type { FileWithAdditionalData } from '../types';

export const useFilesStore = defineStore('files', {
	state: () => ({
		files: [] as FileWithAdditionalData[],
		count: 0
	}),
	actions: {
		async get(page = 0) {
			const response = await getFiles(page);
			// TODO: Error handling
			if (!response) return;
			this.files = response.files;
			this.count = response.count;
		},
		removeFile(uuid: string) {
			this.files = this.files.filter(file => file.uuid !== uuid);
		}
	}
});
