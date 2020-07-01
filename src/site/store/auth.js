/* eslint-disable no-shadow */
// only used so I could keep the convention of naming the first param as "state" in mutations
const getDefaultState = () => ({
	loggedIn: false,
	isLoading: false,
	user: null,
	token: null
});

export const state = getDefaultState;

export const getters = {
	isLoggedIn: state => state.loggedIn
};

export const actions = {
	async verify({ commit, dispatch }) {
		try {
			const response = await this.$axios.$get('verify');
			commit('loginSuccess', response);
		} catch (e) {
			dispatch('alert/set', { text: e.message, error: true }, { root: true });
		}
	},
	async login({ commit, dispatch }, { username, password }) {
		commit('loginRequest');

		try {
			const data = await this.$axios.$post(`auth/login`, { username, password });
			this.$axios.setToken(data.token, 'Bearer');

			commit('setToken', data.token);
			commit('loginSuccess', { token: data.token, user: data.user });
		} catch (e) {
			dispatch('alert/set', { text: e.message, error: true }, { root: true });
		}
	},
	logout({ commit }) {
		commit('logout');
	}
};

export const mutations = {
	setToken(state, token) {
		state.token = token;
	},
	loginRequest(state) {
		state.isLoading = true;
	},
	loginSuccess(state, { user }) {
		this.$cookies.set('token', state.token);
		state.user = user;
		state.loggedIn = true;
		state.isLoading = false;
	},
	logout(state) {
		this.$cookies.remove('token');
		// reset state to default
		Object.assign(state, getDefaultState());
	}
};
