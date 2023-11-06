import { defineStore } from 'pinia';
import type { Album, AlbumForMasonry, AlbumLink } from '../types';
import { getAlbums, getAlbum, getAlbumLinks } from '~/use/api';

export const useAlbumsStore = defineStore('albums', {
	state: () => ({
		albums: [] as Album[],
		album: {} as AlbumForMasonry | null,
		currentAlbumLinks: [] as AlbumLink[],
		currentPage: 1,
		// Total amount of files for pagination
		count: 0,
		selectedAlbumForUpload: null as string | null,
		publicAlbumInfo: null as AlbumForMasonry | null
	}),
	actions: {
		async getPreviousPage() {
			if (!this.album?.uuid) return;
			await this.getAlbum(this.album.uuid, this.currentPage - 1);
		},
		async getNextPage() {
			if (!this.album?.uuid) return;
			await this.getAlbum(this.album.uuid, this.currentPage + 1);
		},
		async goToPage(pageNumber: number) {
			if (!this.album?.uuid) return;
			await this.getAlbum(this.album.uuid, pageNumber);
		},

		async get(force = false) {
			if (!force && this.albums.length) return;

			const response = await getAlbums();
			if (!response) return;
			this.albums = response.albums;
		},
		async getAlbum(uuid: string, page = 1) {
			if (page < 1) return;
			const response = await getAlbum(uuid, page);
			if (!response) return;

			this.currentPage = page;
			this.count = response.album.filesCount;

			this.album = {
				uuid,
				name: response.album.name,
				files: response.album.files,
				isNsfw: response.album.isNsfw,
				count: response.album.filesCount
			};
		},
		async getAlbumLinks(uuid: string) {
			const response = await getAlbumLinks(uuid);
			if (!response) return;
			this.currentAlbumLinks = response.links;
		}
	}
});
