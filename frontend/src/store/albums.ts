import { defineStore } from 'pinia';
import { getAlbums, getAlbum } from '~/use/api';
import type { Album, AlbumForMasonry } from '../types';

export const useAlbumsStore = defineStore('albums', {
	state: () => ({
		albums: [] as Album[],
		album: {} as AlbumForMasonry | null
	}),
	actions: {
		async get(force = false) {
			if (!force && this.albums.length) return;

			const response = await getAlbums();
			if (!response) return;
			this.albums = response.albums;
		},
		async getAlbum(uuid: string) {
			const response = await getAlbum(uuid);
			if (!response) return;

			this.album = {
				uuid,
				name: response.name,
				files: response.files,
				isNsfw: response.isNsfw,
				count: response.filesCount
			};
		}
	}
});
