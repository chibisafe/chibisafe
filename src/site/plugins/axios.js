export default function({ $axios, store }) {
	$axios.setHeader('accept', 'application/vnd.lolisafe.json');
	$axios.onRequest(config => {
		if (store.state.token) {
			config.headers.common['Authorization'] = `bearer ${store.state.token}`;
		}
	});

	$axios.onError(error => {
		if (process.env.development) console.error('[AXIOS Error]', error);
		if (process.browser) {
			store.dispatch('alert', {
				text: error.response.data.message,
				error: true
			});
		}
	});
}
