import { defineStore } from 'pinia';
import { getAlbums } from '~/use/api';
import type { Album } from '../types';

export const useAlbumsStore = defineStore('albums', {
	state: () => ({
		albums: [] as Album[]
	}),
	actions: {
		async get(force = false) {
			if (!force && this.albums.length) return;

			const response = await getAlbums();
			if (!response) return;
			this.albums = response.albums;
		}
	}
});
