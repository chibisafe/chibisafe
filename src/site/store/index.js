import config from '../../../dist/config.json';

export const actions = {
	async nuxtServerInit({ commit, dispatch }) {
		commit('config/set', config);
		const cookies = this.$cookies.getAll();
		if (!cookies.token) return dispatch('auth/logout');

		commit('auth/setToken', cookies.token);
		return dispatch('auth/verify');
	}
};
