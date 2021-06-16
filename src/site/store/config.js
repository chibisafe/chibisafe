export const state = () => ({
	development: process.env.development,
	version: process.env.version,
	URL: process.env.development ? 'http://localhost:5000' : '/',
	baseURL: `${process.env.development ? 'http://localhost:5000' : ''}/api`,
	serviceName: process.env.serviceName,
	maxFileSize: process.env.maxFilesize,
	chunkSize: process.env.chunkSize,
	publicMode: process.env.publicMode,
	userAccounts: process.env.userAccounts
});
