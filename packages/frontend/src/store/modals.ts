import { defineStore } from 'pinia';
import type { FileWithAdditionalData, Album, Tag, User, AlbumLink } from '~/types';
import { getFile, getUserAdmin } from '~/use/api';

export const useModalStore = defineStore('modals', {
	state: () => ({
		login: false,
		generic: {
			show: false
		},
		search: {
			show: false
		},
		fileInformation: {
			show: false,
			file: {} as FileWithAdditionalData | null,
			albums: [] as string[],
			tags: [] as string[]
		},
		deleteFile: {
			show: false,
			admin: false,
			file: {} as FileWithAdditionalData | null
		},
		newAlbum: {
			show: false
		},
		albumSettings: {
			show: false,
			album: {} as Album | null
		},
		manageUser: {
			show: false,
			user: {} as User | null,
			action: '' as String | null
		},
		manageAlbum: {
			show: false,
			album: {} as Album | null,
			action: '' as String | null,
			link: undefined as AlbumLink | undefined,
			callback: {} as Function | null
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
