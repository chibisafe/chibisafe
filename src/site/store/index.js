import config from '../../../dist/config.json';
export const state = () => ({
	loggedIn: false,
	user: null,
	token: null,
	config: null,
	alert: null
});

/* eslint-disable no-shadow */
export const mutations = {
	loggedIn(state, payload) {
		state.loggedIn = payload;
	},
	user(state, payload) {
		state.user = payload;
	},
	token(state, payload) {
		state.token = payload;
	},
	config(state, payload) {
		state.config = payload;
	},
	alert(state, payload) {
		state.alert = payload;
	}
};

export const actions = {
	async nuxtClientInit({ commit, dispatch }, { app, req }) {
		commit('config', config);

		const cookies = this.$cookies.getAll();
		if (!cookies.token) return dispatch('logout');

		commit('token', cookies.token);
		try {
			const response = await this.$axios.$get('verify');
			dispatch('login', {
				token: cookies.token,
				user: response.user
			});
		} catch (error) {
			// dispatch('logout');
		}
	},
	login({ commit }, { token, user }) {
		this.$cookies.set('token', token);
		commit('token', token);
		commit('user', user);
		commit('loggedIn', true);
	},
	logout({ commit }) {
		this.$cookies.remove('token');
		commit('token', null);
		commit('user', null);
		commit('loggedIn', false);
	},
	alert({ commit }, payload) {
		if (!payload) return commit('alert', null);
		commit('alert', {
			text: payload.text,
			error: payload.error
		});
	}
};
