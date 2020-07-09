import Vue from 'vue';

export const state = () => ({
	list: [],
	isListLoading: false,
	albumDetails: {},
	expandedAlbums: [],
	tinyDetails: [],
});

export const getters = {
	isExpanded: (state) => (id) => state.expandedAlbums.indexOf(id) > -1,
	getDetails: (state) => (id) => state.albumDetails[id] || {},
};

export const actions = {
	async fetch({ commit }) {
		commit('albumsRequest');
		const response = await this.$axios.$get('albums/mini');

		commit('setAlbums', response.albums);

		return response;
	},
	async fetchDetails({ commit }, albumId) {
		const response = await this.$axios.$get(`album/${albumId}/links`);

		commit('setDetails', {
			id: albumId,
			details: {
				links: response.links,
			},
		});

		return response;
	},
	async createAlbum({ commit }, name) {
		const response = await this.$axios.$post('album/new', { name });

		commit('addAlbum', response.data);

		return response;
	},
	async deleteAlbum({ commit }, albumId) {
		const response = await this.$axios.$delete(`album/${albumId}`);

		commit('removeAlbum', albumId);

		return response;
	},
	async createLink({ commit }, albumId) {
		const response = await this.$axios.$post('album/link/new', { albumId });

		commit('addAlbumLink', { albumId, data: response.data });

		return response;
	},
	async updateLinkOptions({ commit }, { albumId, linkOpts }) {
		const response = await this.$axios.$post('album/link/edit', {
			identifier: linkOpts.identifier,
			enableDownload: linkOpts.enableDownload,
			enabled: linkOpts.enabled,
		});

		commit('updateAlbumLinkOpts', { albumId, linkOpts: response.data });

		return response;
	},
	async deleteLink({ commit }, { albumId, identifier }) {
		const response = await this.$axios.$delete(`album/link/delete/${identifier}`);

		commit('removeAlbumLink', { albumId, identifier });

		return response;
	},
	async getTinyDetails({ commit }) {
		const response = await this.$axios.$get('albums/dropdown');

		commit('setTinyDetails', response);

		return response;
	},
};

export const mutations = {
	albumsRequest(state) {
		state.isLoading = true;
	},
	setAlbums(state, albums) {
		state.list = albums;
		state.isLoading = false;
	},
	addAlbum(state, album) {
		state.list.unshift(album);
	},
	removeAlbum(state, albumId) {
		// state.list = state.list.filter(({ id }) => id !== albumId);
		const foundIndex = state.list.findIndex(({ id }) => id === albumId);
		state.list.splice(foundIndex, 1);
	},
	setDetails(state, { id, details }) {
		Vue.set(state.albumDetails, id, details);
	},
	addAlbumLink(state, { albumId, data }) {
		state.albumDetails[albumId].links.push(data);
	},
	updateAlbumLinkOpts(state, { albumId, linkOpts }) {
		const foundIndex = state.albumDetails[albumId].links.findIndex(
			({ identifier }) => identifier === linkOpts.identifier,
		);
		const link = state.albumDetails[albumId].links[foundIndex];
		state.albumDetails[albumId].links[foundIndex] = { ...link, ...linkOpts };
	},
	removeAlbumLink(state, { albumId, identifier }) {
		const foundIndex = state.albumDetails[albumId].links.findIndex(({ identifier: id }) => id === identifier);
		if (foundIndex > -1) state.albumDetails[albumId].links.splice(foundIndex, 1);
	},
	toggleExpandedState(state, id) {
		const foundIndex = state.expandedAlbums.indexOf(id);
		if (foundIndex > -1) {
			state.expandedAlbums.splice(foundIndex, 1);
		} else {
			state.expandedAlbums.push(id);
		}
	},
	setTinyDetails(state, { albums }) {
		state.tinyDetails = albums;
	},
};
