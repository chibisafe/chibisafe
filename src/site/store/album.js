export const state = () => ({
	files: [],
	name: null,
	isLoading: false,
	pagination: {
		page: 1,
		limit: 30,
		totalFiles: 0,
	},
	downloadEnabled: false,
});

export const getters = {
	getTotalFiles: ({ pagination }) => pagination.totalFiles,
	getFetchedCount: ({ files }) => files.length,
	shouldPaginate: ({ pagination }) => pagination.totalFiles > pagination.limit,
	getLimit: ({ pagination }) => pagination.limit,
	getName: ({ name }) => name,
};

export const actions = {
	async fetchById({ commit, dispatch, state }, { id, page }) {
		commit('setIsLoading');

		page = page || 1;

		try {
			const response = await this.$axios.$get(`album/${id}/full`, {
				params: { limit: state.pagination.limit, page },
			});

			commit('setFiles', response);
			commit('updatePaginationMeta', { totalFiles: response.count, page });
		} catch (e) {
			dispatch('alert/set', { text: e.message, error: true }, { root: true });
		}
	},
	// TODO: Fix duplicate code between this store and files store
	deleteFile({ commit }, fileId) {

	},
};

export const mutations = {
	setIsLoading(state) {
		state.isLoading = true;
	},
	setFiles(state, { files, name }) {
		state.files = files || [];
		state.name = name;
		state.isLoading = false;
	},
	updatePaginationMeta(state, { page, totalFiles }) {
		state.pagination.page = page || 1;
		state.pagination.totalFiles = totalFiles || 0;
	},
};
