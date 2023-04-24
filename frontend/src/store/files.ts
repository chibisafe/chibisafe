import { defineStore } from 'pinia';
import { getFiles, getFilesAdmin, getFilesFromUser } from '~/use/api';
import type { FileWithAdditionalData, User } from '../types';

interface GetParameters {
	page?: number;
	admin?: boolean;
	userUuid?: string;
}

export const useFilesStore = defineStore('files', {
	state: () => ({
		// Owner of the files, in case an admin is viewing the files of a user
		owner: {} as User,
		// Loaded files from the database
		files: [] as FileWithAdditionalData[],
		// File and page count for pagination
		currentPage: 1,
		count: 0,
		helperData: {
			asAdmin: false,
			userUuid: ''
		}
	}),
	actions: {
		async getPreviousPage() {
			await this.get({
				page: this.currentPage - 1,
				admin: this.helperData.asAdmin,
				userUuid: this.helperData.userUuid
			});
		},
		async getNextPage() {
			await this.get({
				page: this.currentPage + 1,
				admin: this.helperData.asAdmin,
				userUuid: this.helperData.userUuid
			});
		},

		async get(params: GetParameters = {}) {
			const { page, admin, userUuid } = params;

			const pageNumber = page ?? 1;
			if (pageNumber < 1) return;

			this.helperData.asAdmin = admin ?? false;
			this.helperData.userUuid = userUuid ?? '';

			let response;
			if (admin) {
				if (userUuid && userUuid !== '') {
					response = await getFilesFromUser(userUuid, pageNumber);
				} else {
					response = await getFilesAdmin(pageNumber);
				}
			} else {
				response = await getFiles(pageNumber);
			}

			// TODO: Error handling
			if (!response) return;
			this.currentPage = pageNumber;
			this.files = response.files;
			this.count = response.count;
			if ('user' in response) {
				this.owner = response.user as User;
			}
		},
		removeFile(uuid: string) {
			this.files = this.files.filter(file => file.uuid !== uuid);
		}
	}
});
