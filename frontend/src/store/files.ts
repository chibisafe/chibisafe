import { defineStore } from 'pinia';
import { getFiles, getFilesAdmin, getFilesFromUser } from '~/use/api';
import type { FileWithAdditionalData, User } from '../types';

export const useFilesStore = defineStore('files', {
	state: () => ({
		// Owner of the files, in case an admin is viewing the files of a user
		owner: {} as User,
		// Loaded files from the database
		files: [] as FileWithAdditionalData[],
		// Total amount of files for pagination
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
		async getAdmin(page = 0) {
			const response = await getFilesAdmin(page);
			// TODO: Error handling
			if (!response) return;
			this.files = response.files;
			this.count = response.count;
		},
		async getUserAsAdmin(uuid: string, page = 0) {
			const response = await getFilesFromUser(uuid, page);
			// TODO: Error handling
			if (!response) return;
			this.files = response.files;
			this.count = response.count;
			this.owner = response.user;
		},
		removeFile(uuid: string) {
			this.files = this.files.filter(file => file.uuid !== uuid);
		}
	}
});
