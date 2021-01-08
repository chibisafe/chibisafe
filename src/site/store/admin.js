export const state = () => ({
	users: [],
	user: {
		id: null,
		username: null,
		enabled: false,
		createdAt: null,
		editedAt: null,
		apiKeyEditedAt: null,
		isAdmin: null,
		files: []
	},
	file: {},
	settings: {},
	statistics: {}
});

export const actions = {
	async fetchSettings({ commit }) {
		const response = await this.$axios.$get('service/config');
		commit('setSettings', response);

		return response;
	},
	async fetchStatistics({ commit }) {
		const response = await this.$axios.$get('service/statistics');
		commit('setStatistics', response);

		return response;
	},
	async fetchUsers({ commit }) {
		const response = await this.$axios.$get('admin/users');
		commit('setUsers', response);

		return response;
	},
	async fetchUser({ commit }, id) {
		const response = await this.$axios.$get(`admin/users/${id}`);
		commit('setUserInfo', response);

		return response;
	},
	async fetchFile({ commit }, id) {
		const response = await this.$axios.$get(`admin/file/${id}`);
		commit('setFile', response);
		commit('setUserInfo', response);

		return response;
	},
	async banIP(_, ip) {
		const response = await this.$axios.$post('admin/ban/ip', { ip });

		return response;
	},
	async enableUser({ commit }, id) {
		const response = await this.$axios.$post('admin/users/enable', { id });

		commit('changeUserState', { userId: id, enabled: true });

		return response;
	},
	async disableUser({ commit }, id) {
		const response = await this.$axios.$post('admin/users/disable', { id });

		commit('changeUserState', { userId: id, enabled: false });

		return response;
	},
	async promoteUser({ commit }, id) {
		const response = await this.$axios.$post('admin/users/promote', { id });

		commit('changeUserState', { userId: id, isAdmin: true });

		return response;
	},
	async demoteUser({ commit }, id) {
		const response = await this.$axios.$post('admin/users/demote', { id });

		commit('changeUserState', { userId: id, isAdmin: false });

		return response;
	},
	async purgeUserFiles(_, id) {
		const response = await this.$axios.$post('admin/users/purge', { id });

		return response;
	},
	async restartService() {
		const response = await this.$axios.$post('service/restart');

		return response;
	}
};

export const mutations = {
	setSettings(state, { config }) {
		state.settings = config;
	},
	setStatistics(state, { statistics }) {
		state.statistics = statistics;
	},
	setUsers(state, { users }) {
		state.users = users;
	},
	setUserInfo(state, { user, files }) {
		state.user = { ...state.user, ...user };
		state.user.files = files || [];
	},
	setFile(state, { file }) {
		state.file = file || {};
	},
	changeUserState(state, { userId, enabled, isAdmin }) {
		const foundIndex = state.users.findIndex(({ id }) => id === userId);
		if (foundIndex > -1) {
			if (enabled !== undefined) {
				state.users[foundIndex].enabled = enabled;
			}
			if (isAdmin !== undefined) {
				state.users[foundIndex].isAdmin = isAdmin;
			}
		}

		if (state.user.id === userId) {
			if (enabled !== undefined) {
				state.user.enabled = enabled;
			}
			if (isAdmin !== undefined) {
				state.user.isAdmin = isAdmin;
			}
		}
	}
};
