const request = {
	authorizationToken: '',
	checkForToken: () => {
		if (request.authorizationToken) return request.authorizationToken;

		const user = localStorage.getItem('chibisafe-user');
		if (user) {
			const { token } = JSON.parse(user);
			request.authorizationToken = `Bearer ${token}`;
		}

		return request.authorizationToken;
	},

	parseResponse: async (response: Response) => {
		if (response.status !== 200) {
			const error = await response.json();
			throw new Error(error.message);
		}

		return response.json();
	},

	get: async (url = '', data = {}) => {
		try {
			let queryUrl = `/api/${url}`;

			// Check if we are passing any arguments and parse them if so
			if (Object.keys(data).length) {
				// eslint-disable-next-line n/prefer-global/url-search-params
				queryUrl += `?${new URLSearchParams(data)}`;
			}

			const response = await fetch(queryUrl, {
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					Authorization: request.checkForToken()
					// 'Content-Type': 'application/x-www-form-urlencoded',
				}
			});
			return await request.parseResponse(response);
		} catch (error: any) {
			throw new Error(error.message);
		}
	}
};

export default request;
