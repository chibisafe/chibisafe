import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
	loggedIn: false,
	user: {},
	token: null,
	config: null
};

/* eslint-disable no-shadow */
const mutations = {
	loggedIn(state, payload) {
		state.loggedIn = payload;
	},
	user(state, payload) {
		if (!payload) {
			state.user = {};
			localStorage.removeItem('ls-user');
			return;
		}
		localStorage.setItem('ls-user', JSON.stringify(payload));
		state.user = payload;
	},
	token(state, payload) {
		if (!payload) {
			localStorage.removeItem('ls-token');
			state.token = null;
			return;
		}
		localStorage.setItem('ls-token', payload);
		setAuthorizationHeader(payload);
		state.token = payload;
	},
	config(state, payload) {
		state.config = payload;
	}
};

const setAuthorizationHeader = payload => {
	Vue.axios.defaults.headers.common.Authorization = payload ? `Bearer ${payload}` : '';
};

const store = new Vuex.Store({
	state,
	mutations
});

export default store;
