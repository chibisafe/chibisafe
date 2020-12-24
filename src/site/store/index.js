import config from '../../../dist/config.json';

// eslint-disable-next-line import/prefer-default-export
export const actions = {
	async nuxtClientInit({ commit, dispatch }) {
		commit('config/set', config);

		const cookies = this.$cookies.getAll();
		if (!cookies.token) return dispatch('auth/logout');

		commit('auth/setToken', cookies.token);
		return dispatch('auth/verify');
	}
	/* 	alert({ commit }, payload) {
		if (!payload) return commit('alert', null);
		commit('alert', {
			text: payload.text,
			error: payload.error
		});
	} */
};
