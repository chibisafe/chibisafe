/* eslint-disable no-shadow */
export const state = () => ({
	files: [],
	isLoading: false,
	pagination: {
		page: 1,
		limit: 30,
		totalFiles: 0
	}
});

export const getters = {
	getTotalFiles: ({ pagination }) => pagination.totalFiles,
	getFetchedCount: ({ files }) => files.length,
	shouldPaginate: ({ pagination }) => pagination.totalFiles > pagination.limit,
	getLimit: ({ pagination }) => pagination.limit
};

export const actions = {
	async fetch({ commit, dispatch, state }, page) {
		commit('setIsLoading');

		page = page || 1;

		try {
			const response = await this.$axios.$get(`files`, { params: { limit: state.pagination.limit, page } });

			commit('setFiles', { files: response.files });
			commit('updatePaginationMeta', { totalFiles: response.count, page });
		} catch (e) {
			dispatch('alert/set', { text: e.message, error: true }, { root: true });
		}
	},
	async fetchById({ commit, dispatch }) {
		try {
			const response = await this.$axios.$get('verify');
			commit('loginSuccess', response);
		} catch (e) {
			dispatch('alert/set', { text: e.message, error: true }, { root: true });
		}
	}
};

export const mutations = {
	setIsLoading(state) {
		state.isLoading = true;
	},
	setFiles(state, { files }) {
		state.files = files || [];
		state.isLoading = false;
	},
	updatePaginationMeta(state, { page, totalFiles }) {
		state.pagination.page = page || 1;
		state.pagination.totalFiles = totalFiles || 0;
	}
};
