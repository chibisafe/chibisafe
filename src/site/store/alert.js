import AlertTypes from '~/constants/alertTypes';

const getDefaultState = () => ({
	message: null,
	type: null,
	snackbar: false,
});

export const state = getDefaultState;

export const actions = {
	set({ commit }, data) {
		// Only exists for backwards compatibility, remove one day
		if (data.error === true) data.type = AlertTypes.ERROR;
		if (data.text !== undefined) data.message = data.text;

		commit('set', data);
	},
	clear({ commit }) {
		commit('clear');
	},
};

export const mutations = {
	set(state, { message, type, snackbar }) {
		state.message = message;
		state.type = type;
		state.snackbar = snackbar || false;
	},
	clear(state) {
		Object.assign(state, getDefaultState());
	},
};
