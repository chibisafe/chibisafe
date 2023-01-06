import { defineStore } from 'pinia';
import type { FileWithAdditionalData, Album, Tag, User } from '~/types';
import { getFile, getUserAdmin } from '~/use/api';

export const useModalstore = defineStore('modals', {
	state: () => ({
		login: false,
		fileInformation: {
			show: false,
			file: {} as FileWithAdditionalData | null,
			albums: [] as string[],
			tags: [] as string[],
			user: {} as User
		},
		deleteFile: {
			show: false,
			file: {} as FileWithAdditionalData | null
		},
		newAlbum: {
			show: false
		},
		albumSettings: {
			show: false,
			album: {} as Album | null
		}
	}),
	actions: {
		async getFileAlbums() {
			if (!this.fileInformation.file?.uuid) return;
			const file = await getFile(this.fileInformation.file.uuid);
			if (!file) return;
			this.fileInformation.albums = file.albums.map((album: Album) => album.uuid);
			this.fileInformation.tags = file.tags.map((tag: Tag) => tag.uuid);
		},
		async getFileUser() {
			if (!this.fileInformation.file?.user) return;
			const user = await getUserAdmin(this.fileInformation.file.user.uuid);
			if (!user) return;
			this.fileInformation.user = user.user;
		}
	}
});
