export default function({ $axios, store }) {
	$axios.setHeader('accept', 'application/vnd.lolisafe.json');

	$axios.onRequest(config => {
		if (store.state.auth.token) {
			config.headers.common['Authorization'] = `bearer ${store.state.auth.token}`;
		}
	});

	$axios.onError(error => {
		if (process.env.development) console.error('[AXIOS Error]', error);
		if (process.browser) {
			store.dispatch('alert/set', {
				text: error.response.data.message,
				error: true
			});

			if (error.response.data.message.indexOf('Token expired') !== -1) {
				store.dispatch('auth/logout');
			}
		}
	});
}
