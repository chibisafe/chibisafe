/* eslint-disable no-shadow */
export const state = () => ({
	list: [],
	isListLoading: false,
	albumDetails: {},
	expandedAlbums: []
});

export const getters = {
	isExpanded: state => id => state.expandedAlbums.indexOf(id) > -1,
	getDetails: state => id => state.albumDetails[id] || {}
};

export const actions = {
	async fetch({ commit, dispatch }) {
		try {
			commit('albumsRequest');
			const response = await this.$axios.$get(`albums/mini`);

			commit('setAlbums', response.albums);
		} catch (e) {
			dispatch('alert/set', { text: e.message, error: true }, { root: true });
		}
	},
	async fetchDetails({ commit }, albumId) {
		const response = await this.$axios.$get(`album/${albumId}/links`);

		commit('setDetails', {
			id: albumId,
			details: {
				links: response.links
			}
		});
	}
};

export const mutations = {
	albumsRequest(state) {
		state.isLoading = true;
	},
	setAlbums(state, albums) {
		state.list = albums;
		state.isLoading = false;
	},
	setDetails(state, { id, details }) {
		state.albumDetails[id] = details;
	},
	toggleExpandedState(state, id) {
		const foundIndex = state.expandedAlbums.indexOf(id);
		if (foundIndex > -1) {
			state.expandedAlbums.splice(foundIndex, 1);
		} else {
			state.expandedAlbums.push(id);
		}
	}
};
