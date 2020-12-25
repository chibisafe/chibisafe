export default function({ $axios, store }) {
	$axios.setHeader('accept', 'application/vnd.chibisafe.json');

	$axios.onRequest(config => {
		if (store.state.auth.token) {
			config.headers.common.Authorization = `bearer ${store.state.auth.token}`;
		}
	});

	$axios.onError(error => {
		if (process.env.NODE_ENV !== 'production') console.error('[AXIOS Error]', error);
		if (process.browser) {
			if (process.env.NODE_ENV !== 'production') {
				if (error.response?.data?.message) {
					store.dispatch('alert/set', {
						text: error.response.data.message,
						error: true
					});
				} else {
					store.dispatch('alert/set', {
						text: `[AXIOS]: ${error.message}`,
						error: true
					});
				}
			}

			/* if (error.response?.data?.message.indexOf('Token expired') !== -1) {
				store.dispatch('auth/logout');
			} */
		}
	});
}
