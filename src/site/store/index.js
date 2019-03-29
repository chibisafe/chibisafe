/*
import Vue from 'vue';
import axios from 'axios';
*/

const cookieparser = process.server ? require('cookieparser') : null;

export const state = () => ({
	loggedIn: false,
	user: null,
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
			state.user = null;
			return;
		}
		state.user = payload;
	},
	token(state, payload) {
		if (!payload) {
			state.token = null;
			return;
		}
		state.token = payload;
	},
	config(state, payload) {
		state.config = payload;
	}
};

export const actions = {
	async nuxtServerInit({ commit }, { app, req }) {
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

		let token = null;
		if (req.headers.cookie) {
			try {
				token = cookieparser.parse(req.headers.cookie).token;
				console.log(token);
				commit('loggedIn', true);
				commit('token', token);

				app.$axios.setToken(token, 'Bearer');

				const data = await this.$axios.$get(`verify`);
				if (!data || !data.user);
				commit('user', data.user);
			} catch (error) {
				// TODO: Deactivate this on production
				console.error(error);
			}
		}
		commit('token', token);
		if (!token) {
			app.$axios.setToken('');
			commit('user', null);
			commit('loggedIn', false);
		}
	},
	login({ commit }, { app, token, user }) {
		commit('token', token);
		commit('user', user);
		commit('loggedIn', true);
	}
};
