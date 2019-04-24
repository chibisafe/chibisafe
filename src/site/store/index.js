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
	async nuxtServerInit({ commit, dispatch }, { app, req }) {
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
			dispatch('logout');
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
