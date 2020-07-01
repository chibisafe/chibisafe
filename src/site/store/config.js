/* eslint-disable no-shadow */
export const state = () => ({
	development: true,
	version: '4.0.0',
	URL: 'http://localhost:8080',
	baseURL: 'http://localhost:8080/api',
	serviceName: '',
	maxFileSize: 100,
	chunkSize: 90,
	maxLinksPerAlbum: 5,
	publicMode: false,
	userAccounts: false
});

export const mutations = {
	set(state, config) {
		Object.assign(state, config);
	}
};
