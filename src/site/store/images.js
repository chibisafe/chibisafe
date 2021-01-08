import Vue from 'vue';

export const getDefaultState = () => ({
	files: [],
	isLoading: false,
	pagination: {
		page: 1,
		limit: 50,
		totalFiles: 0
	},
	search: '',
	showList: false,
	albumName: null,
	albumDownloadEnabled: false,
	fileExtraInfoMap: {}, // information about the selected file
	fileAlbumsMap: {}, // map of file ids with a list of album objects the file is in
	fileTagsMap: {} // map of file ids with a list of tag objects for the file
});

export const state = getDefaultState;

export const getters = {
	getTotalFiles: ({ pagination }) => pagination.totalFiles,
	getFetchedCount: ({ files }) => files.length,
	shouldPaginate: ({ pagination }) => pagination.totalFiles > pagination.limit,
	getLimit: ({ pagination }) => pagination.limit,
	getName: ({ name }) => name
};

export const actions = {
	async fetch({ commit, dispatch, state }, page) {
		commit('setIsLoading');

		page = page || 1;

		try {
			const response = await this.$axios.$get('files', { params: { limit: state.pagination.limit, page } });

			commit('setFilesAndMeta', { ...response, page });

			return response;
		} catch (e) {
			dispatch('alert/set', { text: e.message, error: true }, { root: true });
		}

		return null;
	},
	async fetchByAlbumId({ commit, state }, { id, page }) {
		commit('setIsLoading');

		page = page || 1;

		const response = await this.$axios.$get(`album/${id}/full`, {
			params: { limit: state.pagination.limit, page }
		});

		commit('setFilesAndMeta', { ...response, page });

		return response;
	},
	async fetchFileMeta({ commit }, fileId) {
		const response = await this.$axios.$get(`file/${fileId}`);

		commit('setFileAlbums', { ...response, fileId });
		commit('setFileTags', { ...response, fileId });
		commit('setFileExtraInfo', { ...response, fileId });

		return response;
	},
	async getFileAlbums({ commit }, fileId) {
		const response = await this.$axios.$get(`file/${fileId}/albums`);

		commit('setFileAlbums', { ...response, fileId });

		return response;
	},
	async addToAlbum({ commit }, { fileId, albumId }) {
		const response = await this.$axios.$post('file/album/add', { fileId, albumId });

		commit('addAlbumToFile', { fileId, albumId, ...response.data });

		return response;
	},
	async removeFromAlbum({ commit }, { fileId, albumId }) {
		const response = await this.$axios.$post('file/album/del', { fileId, albumId });

		commit('removeAlbumFromFile', { fileId, albumId });

		return response;
	},
	async deleteFile({ commit }, fileId) {
		const response = await this.$axios.$delete(`file/${fileId}`);

		commit('removeFile', fileId);

		return response;
	},
	async addTag({ commit }, { fileId, tagName }) {
		const response = await this.$axios.$post('file/tag/add', { fileId, tagName });

		commit('addTagToFile', response.data);

		return response;
	},
	async removeTag({ commit }, { fileId, tagName }) {
		const response = await this.$axios.$post('file/tag/del', { fileId, tagName });

		commit('removeTagFromFile', response.data);

		return response;
	},
	async search({ commit, dispatch, state }, { q, albumId, page }) {
		page = page || 1;

		try {
			const response = await this.$axios.$get('search', { params: { q: encodeURI(q), limit: state.pagination.limit, page, albumId } });

			commit('setFilesAndMeta', { ...response, page, name: state.albumName });

			return response;
		} catch (e) {
			dispatch('alert/set', { text: e.message, error: true }, { root: true });
		}

		return null;
	}
};

export const mutations = {
	setIsLoading(state) {
		state.isLoading = true;
	},
	setFilesAndMeta(state, {
		files, name, page, count, downloadEnabled
	}) {
		state.files = files || [];
		state.albumName = name ?? null;
		state.downloadEnabled = downloadEnabled ?? false;
		state.isLoading = false;
		state.pagination.page = page || 1;
		state.pagination.totalFiles = count || 0;
	},
	removeFile(state, fileId) {
		const foundIndex = state.files.findIndex(({ id }) => id === fileId);
		if (foundIndex > -1) {
			state.files.splice(foundIndex, 1);
			state.pagination.totalFiles -= 1;
		}
	},
	setFileAlbums(state, { fileId, albums }) {
		Vue.set(state.fileAlbumsMap, fileId, albums);
	},
	setFileTags(state, { fileId, tags }) {
		Vue.set(state.fileTagsMap, fileId, tags);
	},
	setFileExtraInfo(state, { fileId, file }) {
		Vue.set(state.fileExtraInfoMap, fileId, file);
	},
	addAlbumToFile(state, { fileId, album }) {
		if (!state.fileAlbumsMap[fileId]) return;

		state.fileAlbumsMap[fileId].push(album);
	},
	removeAlbumFromFile(state, { fileId, albumId }) {
		if (!state.fileAlbumsMap[fileId]) return;

		const foundIndex = state.fileAlbumsMap[fileId].findIndex(({ id }) => id === albumId);
		if (foundIndex > -1) {
			state.fileAlbumsMap[fileId].splice(foundIndex, 1);
		}
	},
	addTagToFile(state, { fileId, tag }) {
		if (!state.fileTagsMap[fileId]) return;

		state.fileTagsMap[fileId].push(tag);
	},
	removeTagFromFile(state, { fileId, tag }) {
		if (!state.fileTagsMap[fileId]) return;

		const foundIndex = state.fileTagsMap[fileId].findIndex(({ id }) => id === tag.id);
		if (foundIndex > -1) {
			state.fileTagsMap[fileId].splice(foundIndex, 1);
		}
	},
	setShowList(state, showList) {
		state.showList = showList;
	},
	resetState(state) {
		Object.assign(state, getDefaultState());
	}
};
