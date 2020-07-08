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
		files: [],
	},
	file: {},
	settings: {},
});

export const actions = {
	async fetchUsers({ commit }) {
		const response = await this.$axios.$get('admin/users');
		commit('setUsers', response);

		return response;
	},
	async fetchUser({ commit }, id) {
		const response = await this.$axios.$get(`/admin/users/${id}`);
		commit('setUserInfo', response);

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
};

export const mutations = {
	setUsers(state, { users }) {
		state.users = users;
	},
	setUserInfo(state, { user, files }) {
		state.user = { ...state.user, ...user };
		state.user.files = files || [];
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
};
