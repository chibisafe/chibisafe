export const state = () => ({
	tagsList: [],
});

export const actions = {
	async fetch({ commit }) {
		const response = await this.$axios.$get('tags');

		commit('setTags', response.tags);

		return response;
	},
	async createTag({ commit }, name) {
		const response = await this.$axios.$post('tag/new', { name });

		commit('addTag', response.data);

		return response;
	},
	async deleteTag({ commit }, tagId) {
		const response = await this.$axios.$delete(`tag/${tagId}`);

		commit('deleteTag', response.data);

		return response;
	},
};

export const mutations = {
	setTags(state, tags) {
		state.tagsList = tags;
	},
	addTag(state, tag) {
		state.tagsList.unshift(tag);
	},
	deleteTag(state, { id: tagId }) {
		const foundIndex = state.tagsList.findIndex(({ id }) => id === tagId);
		state.tagsList.splice(foundIndex, 1);
	},
};
