import Vue from 'vue';
import Vuex from 'vuex';

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
			localStorage.removeItem('lolisafe-user');
			return;
		}
		localStorage.setItem('lolisafe-user', JSON.stringify(payload));
		state.user = payload;
	},
	token(state, payload) {
		if (!payload) {
			localStorage.removeItem('lolisafe-token');
			state.token = null;
			return;
		}
		localStorage.setItem('lolisafe-token', payload);
		setAuthorizationHeader(payload);
		state.token = payload;
	},
	config(state, payload) {
		state.config = payload;
	}
};

const actions = {
	nuxtServerInit({ commit }, { req }) {
		/* TODO: Get env variables from context/process */
		const config = require('~/config.js');
		commit('config', config);
	}
};

const setAuthorizationHeader = payload => {
	console.log('hihi');
	Vue.axios.defaults.headers.common.Authorization = payload ? `Bearer ${payload}` : '';
};

const store = () => new Vuex.Store({
	state,
	mutations,
	actions
});

export default store;
