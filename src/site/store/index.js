import Vue from 'vue';
import Vuex from 'vuex';

export const state = () => ({
	loggedIn: false,
	user: {},
	token: null,
	config: null
});

/* eslint-disable no-shadow */
export const mutations = {
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

export const actions = {
	nuxtServerInit({ commit }, { req }) {
		commit('config', {
			version: process.env.npm_package_version,
			URL: process.env.DOMAIN,
			baseURL: `${process.env.DOMAIN}${process.env.ROUTE_PREFIX}`,
			serviceName: process.env.SERVICE_NAME,
			maxFileSize: parseInt(process.env.MAX_SIZE, 10),
			chunkSize: parseInt(process.env.CHUNK_SIZE, 10),
			maxLinksPerAlbum: parseInt(process.env.MAX_LINKS_PER_ALBUM, 10),
			publicMode: process.env.PUBLIC_MODE == 'true' ? true : false,
			enableAccounts: process.env.USER_ACCOUNTS == 'true' ? true : false
		});
	}
};

const setAuthorizationHeader = payload => {
	Vue.axios.defaults.headers.common.Authorization = payload ? `Bearer ${payload}` : '';
};
