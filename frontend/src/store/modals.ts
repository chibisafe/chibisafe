import { defineStore } from 'pinia';
import type { FileWithAdditionalData, Album } from '~/types';
import { getFile } from '~/use/api';

export const useModalstore = defineStore('modals', {
	state: () => ({
		login: false,
		fileInformation: {
			show: false,
			file: {} as FileWithAdditionalData | null,
			albums: [] as string[]
		},
		deleteFile: {
			show: false,
			file: {} as FileWithAdditionalData | null
		}
	}),
	actions: {
		async getFileAlbums() {
			if (!this.fileInformation.file?.uuid) return;
			const file = await getFile(this.fileInformation.file.uuid);
			if (!file) return;
			this.fileInformation.albums = file.albums.map((album: Album) => album.uuid);
		}
	}
});
