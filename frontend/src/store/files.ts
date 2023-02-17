import { defineStore } from 'pinia';
import { getFiles, getFilesAdmin, getFilesFromUser } from '~/use/api';
import type { FileWithAdditionalData, User } from '../types';

export const useFilesStore = defineStore('files', {
	state: () => ({
		// Owner of the files, in case an admin is viewing the files of a user
		owner: {} as User,
		// Loaded files from the database
		files: [] as FileWithAdditionalData[],
		// File and page count for pagination
		currentPage: 1,
		adminCurrentPage: 1,
		count: 0,
		adminCount: 0
	}),
	actions: {
		async getPreviousPage() {
			await this.get(this.currentPage - 1);
		},
		async getPreviousPageAdmin() {
			await this.getAdmin(this.adminCurrentPage - 1);
		},
		async getNextPage() {
			await this.get(this.currentPage + 1);
		},
		async getNextPageAdmin() {
			await this.getAdmin(this.adminCurrentPage + 1);
		},

		async get(page = 1) {
			if (page < 1) return;
			const response = await getFiles(page);
			// TODO: Error handling
			if (!response) return;
			this.currentPage = page;
			this.files = response.files;
			this.count = response.count;
		},
		async getAdmin(page = 1) {
			if (page < 1) return;
			const response = await getFilesAdmin(page);
			// TODO: Error handling
			if (!response) return;
			this.adminCurrentPage = page;
			this.files = response.files;
			this.adminCount = response.count;
		},
		async getUserAsAdmin(uuid: string, page = 0) {
			const response = await getFilesFromUser(uuid, page);
			// TODO: Error handling
			if (!response) return;
			this.currentPage = page;
			this.files = response.files;
			this.count = response.count;
			this.owner = response.user;
		},
		removeFile(uuid: string) {
			this.files = this.files.filter(file => file.uuid !== uuid);
		}
	}
});
