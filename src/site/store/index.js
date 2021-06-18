export const actions = {
	async nuxtServerInit({ commit, dispatch }) {
		await dispatch('config/fetchSettings');
		const cookies = this.$cookies.getAll();
		if (!cookies.token) return dispatch('auth/logout');

		commit('auth/setToken', cookies.token);
		return dispatch('auth/verify');
	}
};
