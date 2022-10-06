let authorizationToken = '';
const checkForToken = () => {
	if (authorizationToken) return authorizationToken;

	const user = localStorage.getItem('chibisafe-user');
	if (user) {
		const { token } = JSON.parse(user);
		authorizationToken = `Bearer ${token}`;
	}

	return authorizationToken;
};

export const request = {
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
					Authorization: checkForToken()
					// 'Content-Type': 'application/x-www-form-urlencoded',
				}
			});
			return await response.json();
		} catch (error) {
			console.log(error);
		}
	},

	post: async (url = '', data = {}) => {
		try {
			const response = await fetch(`/api/${url}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
					// Authorization: checkForToken()
				},
				body: JSON.stringify(data)
			});
			return await response.json();
		} catch (error) {
			console.log(error);
		}
	}
};
