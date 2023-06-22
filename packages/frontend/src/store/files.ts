import { defineStore } from 'pinia';
import { getFiles, getFilesAdmin, getFilesFromUser, getFilesFromIP, searchFiles } from '~/use/api';
import type { FileWithAdditionalData, User } from '../types';

interface GetParameters {
	page?: number;
	admin?: boolean;
	userUuid?: string;
	ip?: string;
	searchTerm?: string;
	publicOnly?: boolean;
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
			userUuid: '',
			ip: '',
			searchTerm: '',
			publicOnly: false
		},
		isBanned: false
	}),
	actions: {
		async getPreviousPage() {
			await this.get({
				page: this.currentPage - 1,
				admin: this.helperData.asAdmin,
				userUuid: this.helperData.userUuid,
				ip: this.helperData.ip,
				searchTerm: this.helperData.searchTerm,
				publicOnly: this.helperData.publicOnly
			});
		},
		async getNextPage() {
			await this.get({
				page: this.currentPage + 1,
				admin: this.helperData.asAdmin,
				userUuid: this.helperData.userUuid,
				ip: this.helperData.ip,
				searchTerm: this.helperData.searchTerm,
				publicOnly: this.helperData.publicOnly
			});
		},
		async goToPage(pageNumber: number) {
			await this.get({
				page: pageNumber,
				admin: this.helperData.asAdmin,
				userUuid: this.helperData.userUuid,
				ip: this.helperData.ip,
				searchTerm: this.helperData.searchTerm,
				publicOnly: this.helperData.publicOnly
			});
		},

		async get(params: GetParameters = {}) {
			const { page, admin, userUuid, ip, searchTerm, publicOnly } = params;

			const pageNumber = page ?? 1;
			if (pageNumber < 1) return;

			this.helperData.asAdmin = admin ?? false;
			this.helperData.userUuid = userUuid ?? '';
			this.helperData.ip = ip ?? '';
			this.helperData.searchTerm = searchTerm ?? '';
			this.helperData.publicOnly = publicOnly ?? false;

			let response:
				| {
						files: FileWithAdditionalData[];
						count: number;
						user?: User;
						banned?: boolean;
				  }
				| undefined;

			if (admin) {
				if (userUuid && userUuid !== '') {
					response = await getFilesFromUser(userUuid, pageNumber);
				} else if (ip && ip !== '') {
					response = await getFilesFromIP(ip, pageNumber);
				} else {
					response = await getFilesAdmin(pageNumber, publicOnly);
				}
			} else if (searchTerm && searchTerm !== '') {
				response = await searchFiles(searchTerm, pageNumber);
			} else {
				response = await getFiles(pageNumber);
			}

			// TODO: Error handling
			if (!response) return;
			this.currentPage = pageNumber;
			this.files = response.files;
			this.count = response.count;
			if (response.user) {
				this.owner = response.user as User;
			}

			if (response.banned) {
				this.isBanned = response.banned;
			}
		},
		removeFile(uuid: string) {
			this.files = this.files.filter(file => file.uuid !== uuid);
		}
	}
});
