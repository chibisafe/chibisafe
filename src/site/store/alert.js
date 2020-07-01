/* eslint-disable no-shadow */
const getDefaultState = () => ({
	text: null,
	error: false
});

export const state = getDefaultState;

export const actions = {
	set({ commit }, data) {
		commit('set', data);
	},
	clear({ commit }) {
		commit('clear');
	}
};

export const mutations = {
	set(state, { text, error }) {
		state.text = text;
		state.error = error;
	},
	clear(state) {
		Object.assign(state, getDefaultState());
	}
};
