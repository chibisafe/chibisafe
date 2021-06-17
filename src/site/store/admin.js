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
	statistics: {},
	settingsSchema: {
		type: null,
		keys: {}
	}
});

export const actions = {
	async fetchSettings({ commit }) {
		const response = await this.$axios.$get('service/config/all');
		commit('setSettings', response);

		return response;
	},
	async saveSettings({ commit }, settings) {
		const response = await this.$axios.$post('service/config', { settings });

		return response;
	},
	async fetchStatistics({ commit }, category) {
		const url = category ? `service/statistics/${category}` : 'service/statistics';
		const response = await this.$axios.$get(url);
		commit('setStatistics', { statistics: response.statistics, category });

		return response;
	},
	async getSettingsSchema({ commit }) {
		// XXX: Maybe move to the config store?
		const response = await this.$axios.$get('service/config/schema');

		commit('setSettingsSchema', response);
	},
	async fetchUsers({ commit }) {
		const response = await this.$axios.$get('admin/users');
		commit('setUsers', response);

		return response;
	},
	async fetchUser({ commit }, { id, page }) {
		page = page || 1;
		const response = await this.$axios.$get(`admin/users/${id}`, { params: { limit: 50, page } });
		commit('setUserInfo', { ...response, page });

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
	setStatistics(state, { statistics, category }) {
		if (category) {
			state.statistics[category] = statistics[category];
		} else {
			state.statistics = statistics;
		}
	},
	setSettings(state, { config }) {
		state.settings = config;
	},
	setSettingsSchema(state, { schema }) {
		state.settingsSchema = schema;
	},
	setUsers(state, { users }) {
		state.users = users;
	},
	setUserInfo(state, { user, files, count }) {
		state.user = { ...state.user, ...user };
		state.user.files = files || [];
		state.user.totalFiles = count;
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
	},
	populateSchemaWithValues({ settings, settingsSchema }) {
		for (const [key, value] of Object.entries(settings)) {
			if (settingsSchema.keys?.[key] !== undefined) {
				settingsSchema.keys[key].value = value;
			}
		}
	}
};
