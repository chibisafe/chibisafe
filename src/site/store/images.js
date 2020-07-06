export const state = () => ({
	files: [],
	isLoading: false,
	pagination: {
		page: 1,
		limit: 30,
		totalFiles: 0,
	},
	name: null,
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
	async fetch({ commit, dispatch, state }, page) {
		commit('setIsLoading');

		page = page || 1;

		try {
			const response = await this.$axios.$get('files', { params: { limit: state.pagination.limit, page } });

			commit('setFilesAndMeta', { ...response, page });
		} catch (e) {
			dispatch('alert/set', { text: e.message, error: true }, { root: true });
		}
	},
	async fetchByAlbumId({ commit, dispatch, state }, { id, page }) {
		commit('setIsLoading');

		page = page || 1;

		const response = await this.$axios.$get(`album/${id}/full`, {
			params: { limit: state.pagination.limit, page },
		});

		commit('setFilesAndMeta', { ...response, page });
	},
};

export const mutations = {
	setIsLoading(state) {
		state.isLoading = true;
	},
	setFilesAndMeta(state, {
		files, name, page, count,
	}) {
		state.files = files || [];
		state.name = name ?? null;
		state.isLoading = false;
		state.pagination.page = page || 1;
		state.pagination.totalFiles = count || 0;
	},
};
