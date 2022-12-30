import { defineStore } from 'pinia';
import type { FileWithAdditionalData, Album, Tag } from '~/types';
import { getFile } from '~/use/api';

export const useModalstore = defineStore('modals', {
	state: () => ({
		login: false,
		fileInformation: {
			show: false,
			file: {} as FileWithAdditionalData | null,
			albums: [] as string[],
			tags: [] as string[]
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
		}
	}
});
