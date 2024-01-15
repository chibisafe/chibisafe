import { defineStore } from 'pinia';
import { getAlbums, getAlbum, getAlbumLinks } from '~/use/api';
import type { Album, AlbumForMasonry, AlbumLink } from '../types';

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
			this.count = response.count;

			this.album = {
				uuid,
				name: response.name,
				description: response.description,
				files: response.files,
				isNsfw: response.isNsfw,
				count: response.count
			};
		},
		async getAlbumLinks(uuid: string) {
			const response = await getAlbumLinks(uuid);
			if (!response) return;
			this.currentAlbumLinks = response.links;
		}
	}
});
