export const state = () => ({
	development: process.env.development,
	version: '',
	URL: process.env.development ? 'http://localhost:5000' : '/',
	baseURL: `${process.env.development ? 'http://localhost:5000' : ''}/api`,
	serviceName: '',
	maxUploadSize: 0,
	chunkSize: 0,
	publicMode: false,
	userAccounts: false
});

export const actions = {
	async fetchSettings({ commit }) {
		const response = await this.$axios.$get('service/config');
		commit('setSettings', response);

		return response;
	}
};

export const mutations = {
	setSettings(state, { config }) {
		state.version = `v${config.version}`;
		state.serviceName = config.serviceName;
		state.maxUploadSize = config.maxUploadSize;
		state.filenameLength = config.filenameLength;
		state.albumLinkLength = config.albumLinkLength;
		state.chunkSize = config.chunkSize;
		state.publicMode = config.publicMode;
		state.userAccounts = config.userAccounts;
		state.URL = config.domain;
		const lastChar = config.domain.substr(-1);
		if (lastChar === '/') {
			state.baseURL = `${config.domain}api`;
		} else {
			state.baseURL = `${config.domain}/api`;
		}
	}
};
